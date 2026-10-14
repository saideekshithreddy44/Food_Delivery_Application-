package com.fooddelivery.service;

import com.fooddelivery.dto.request.CartItemRequest;
import com.fooddelivery.dto.response.CartItemResponse;
import com.fooddelivery.dto.response.CartResponse;
import com.fooddelivery.entity.CartItem;
import com.fooddelivery.entity.FoodItem;
import com.fooddelivery.entity.User;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.CartItemRepository;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final BigDecimal DELIVERY_CHARGE = new BigDecimal("40.00");

    private final CartItemRepository cartItemRepository;
    private final FoodItemRepository foodItemRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public CartResponse getCart(String email) {
        User user = getUserByEmail(email);
        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());

        if (cartItems.isEmpty()) {
            return CartResponse.builder()
                    .items(new ArrayList<>())
                    .subtotal(BigDecimal.ZERO)
                    .deliveryCharge(BigDecimal.ZERO)
                    .total(BigDecimal.ZERO)
                    .itemCount(0)
                    .build();
        }

        List<CartItemResponse> itemResponses = cartItems.stream()
                .map(CartItemResponse::fromEntity)
                .collect(Collectors.toList());

        BigDecimal subtotal = cartItems.stream()
                .map(CartItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = subtotal.add(DELIVERY_CHARGE);
        int itemCount = cartItems.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartResponse.builder()
                .items(itemResponses)
                .subtotal(subtotal)
                .deliveryCharge(DELIVERY_CHARGE)
                .total(total)
                .itemCount(itemCount)
                .build();
    }

    @Transactional
    public CartResponse addToCart(String email, CartItemRequest request) {
        User user = getUserByEmail(email);

        FoodItem foodItem = foodItemRepository.findById(request.getFoodItemId())
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", request.getFoodItemId()));

        if (!foodItem.isAvailable()) {
            throw new BadRequestException("Food item '" + foodItem.getName() + "' is currently unavailable");
        }

        List<CartItem> existingCartItems = cartItemRepository.findByUserId(user.getId());

        if (!existingCartItems.isEmpty()) {
            Long existingRestaurantId = existingCartItems.get(0).getFoodItem().getRestaurant().getId();
            Long newRestaurantId = foodItem.getRestaurant().getId();

            if (!existingRestaurantId.equals(newRestaurantId)) {
                String existingRestaurantName = existingCartItems.get(0).getFoodItem().getRestaurant().getName();
                throw new BadRequestException("Your cart contains items from '" + existingRestaurantName 
                        + "'. You can only order from one restaurant at a time. Please clear your cart first.");
            }
        }

        Optional<CartItem> existingItemOpt = cartItemRepository.findByUserIdAndFoodItemId(user.getId(), foodItem.getId());

        if (existingItemOpt.isPresent()) {
            CartItem cartItem = existingItemOpt.get();
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            cartItemRepository.save(cartItem);
        } else {
            CartItem newCartItem = CartItem.builder()
                    .user(user)
                    .foodItem(foodItem)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(newCartItem);
        }

        return getCart(email);
    }

    @Transactional
    public CartResponse updateCartItemQuantity(String email, Long cartItemId, int quantity) {
        User user = getUserByEmail(email);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to modify this cart item");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return getCart(email);
    }

    @Transactional
    public CartResponse removeFromCart(String email, Long cartItemId) {
        User user = getUserByEmail(email);
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!cartItem.getUser().getId().equals(user.getId())) {
            throw new UnauthorizedException("You do not have permission to delete this cart item");
        }

        cartItemRepository.delete(cartItem);
        return getCart(email);
    }

    @Transactional
    public void clearCart(String email) {
        User user = getUserByEmail(email);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
