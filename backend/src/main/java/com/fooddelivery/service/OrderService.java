package com.fooddelivery.service;

import com.fooddelivery.dto.request.OrderRequest;
import com.fooddelivery.dto.response.OrderResponse;
import com.fooddelivery.entity.*;
import com.fooddelivery.enums.OrderStatus;
import com.fooddelivery.enums.PaymentMethod;
import com.fooddelivery.enums.PaymentStatus;
import com.fooddelivery.enums.UserRole;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("40.00");

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final AddressRepository addressRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest request) {
        User user = getUserByEmail(email);

        Address deliveryAddress = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address", "id", request.getAddressId()));

        if (!deliveryAddress.getUser().getId().equals(user.getId())) {
            throw new BadRequestException("Selected address does not belong to the user");
        }

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty cart");
        }

        // Validate food availability
        for (CartItem ci : cartItems) {
            if (!ci.getFoodItem().isAvailable()) {
                throw new BadRequestException("Food item '" + ci.getFoodItem().getName() + "' is no longer available");
            }
        }

        Restaurant restaurant = cartItems.get(0).getFoodItem().getRestaurant();

        // Calculate totals server-side
        BigDecimal subtotal = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal deliveryFee = DELIVERY_CHARGE;
        BigDecimal grandTotal = subtotal.add(deliveryFee);

        // Generate unique order number
        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Order order = Order.builder()
                .orderNumber(orderNumber)
                .user(user)
                .restaurant(restaurant)
                .deliveryAddress(deliveryAddress)
                .totalAmount(subtotal)
                .deliveryCharge(deliveryFee)
                .grandTotal(grandTotal)
                .status(OrderStatus.PENDING)
                .specialInstructions(request.getSpecialInstructions())
                .build();

        // Build snapshot order items
        for (CartItem ci : cartItems) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .foodItem(ci.getFoodItem())
                    .foodName(ci.getFoodItem().getName())
                    .foodPrice(ci.getFoodItem().getPrice())
                    .quantity(ci.getQuantity())
                    .totalPrice(ci.getTotalPrice())
                    .build();
            order.addOrderItem(orderItem);
        }

        PaymentMethod paymentMethod = request.getPaymentMethod() != null
                ? request.getPaymentMethod()
                : PaymentMethod.CASH_ON_DELIVERY;

        PaymentStatus paymentStatus = (paymentMethod == PaymentMethod.ONLINE)
                ? PaymentStatus.COMPLETED
                : PaymentStatus.PENDING;

        String txnId = "TXN-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase();

        Payment payment = Payment.builder()
                .order(order)
                .amount(grandTotal)
                .paymentMethod(paymentMethod)
                .paymentStatus(paymentStatus)
                .transactionId(txnId)
                .paidAt(paymentStatus == PaymentStatus.COMPLETED ? LocalDateTime.now() : null)
                .build();

        order.setPayment(payment);

        Order savedOrder = orderRepository.save(order);

        // Clear user's cart after successful order creation
        cartItemRepository.deleteByUserId(user.getId());

        return OrderResponse.fromEntity(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getMyOrders(String email) {
        User user = getUserByEmail(email);
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(String email, Long id) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", id));

        boolean isCustomer = order.getUser().getId().equals(user.getId());
        boolean isOwner = order.getRestaurant().getOwner() != null && order.getRestaurant().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isCustomer && !isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have access to view this order");
        }

        return OrderResponse.fromEntity(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getRestaurantOrders(String email) {
        User user = getUserByEmail(email);
        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "ownerId", user.getId()));

        return orderRepository.findByRestaurantIdOrderByCreatedAtDesc(restaurant.getId()).stream()
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderResponse updateOrderStatus(String email, Long orderId, OrderStatus newStatus) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        boolean isOwner = order.getRestaurant().getOwner() != null && order.getRestaurant().getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to update this order's status");
        }

        OrderStatus currentStatus = order.getStatus();

        if (currentStatus == OrderStatus.DELIVERED) {
            throw new BadRequestException("Order is already delivered and cannot be changed");
        }
        if (currentStatus == OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled and cannot be changed");
        }

        // Validate status progression
        boolean validTransition = false;
        switch (currentStatus) {
            case PENDING:
                validTransition = (newStatus == OrderStatus.CONFIRMED || newStatus == OrderStatus.CANCELLED);
                break;
            case CONFIRMED:
                validTransition = (newStatus == OrderStatus.PREPARING || newStatus == OrderStatus.CANCELLED);
                break;
            case PREPARING:
                validTransition = (newStatus == OrderStatus.OUT_FOR_DELIVERY);
                break;
            case OUT_FOR_DELIVERY:
                validTransition = (newStatus == OrderStatus.DELIVERED);
                break;
            default:
                break;
        }

        if (!validTransition) {
            throw new BadRequestException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }

        order.setStatus(newStatus);

        // Update payment status accordingly
        if (newStatus == OrderStatus.DELIVERED && order.getPayment() != null) {
            if (order.getPayment().getPaymentStatus() == PaymentStatus.PENDING) {
                order.getPayment().setPaymentStatus(PaymentStatus.COMPLETED);
                order.getPayment().setPaidAt(LocalDateTime.now());
            }
        } else if (newStatus == OrderStatus.CANCELLED && order.getPayment() != null) {
            if (order.getPayment().getPaymentStatus() == PaymentStatus.COMPLETED) {
                order.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
            }
        }

        Order updatedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(updatedOrder);
    }

    @Transactional
    public OrderResponse cancelOrder(String email, Long orderId) {
        User user = getUserByEmail(email);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You can only cancel your own orders");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new BadRequestException("Cannot cancel order at status: " + order.getStatus() 
                    + ". Only PENDING or CONFIRMED orders can be cancelled.");
        }

        order.setStatus(OrderStatus.CANCELLED);

        if (order.getPayment() != null) {
            if (order.getPayment().getPaymentStatus() == PaymentStatus.COMPLETED) {
                order.getPayment().setPaymentStatus(PaymentStatus.REFUNDED);
            }
        }

        Order updatedOrder = orderRepository.save(order);
        return OrderResponse.fromEntity(updatedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .sorted((o1, o2) -> {
                    if (o1.getCreatedAt() == null || o2.getCreatedAt() == null) return 0;
                    return o2.getCreatedAt().compareTo(o1.getCreatedAt());
                })
                .map(OrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByOrderNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
        return OrderResponse.fromEntity(order);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
