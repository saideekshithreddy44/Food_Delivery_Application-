package com.fooddelivery.dto.response;

import com.fooddelivery.entity.Order;
import com.fooddelivery.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {

    private Long id;
    private String orderNumber;
    private String restaurantName;
    private Long restaurantId;
    private AddressResponse deliveryAddress;
    @Builder.Default
    private List<OrderItemResponse> items = new ArrayList<>();
    private BigDecimal totalAmount;
    private BigDecimal deliveryCharge;
    private BigDecimal grandTotal;
    private OrderStatus status;
    private String specialInstructions;
    private PaymentResponse payment;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static OrderResponse fromEntity(Order order) {
        if (order == null) {
            return null;
        }

        List<OrderItemResponse> orderItems = order.getOrderItems() != null
                ? order.getOrderItems().stream()
                        .map(OrderItemResponse::fromEntity)
                        .collect(Collectors.toList())
                : new ArrayList<>();

        return OrderResponse.builder()
                .id(order.getId())
                .orderNumber(order.getOrderNumber())
                .restaurantName(order.getRestaurant() != null ? order.getRestaurant().getName() : null)
                .restaurantId(order.getRestaurant() != null ? order.getRestaurant().getId() : null)
                .deliveryAddress(order.getDeliveryAddress() != null ? AddressResponse.fromEntity(order.getDeliveryAddress()) : null)
                .items(orderItems)
                .totalAmount(order.getTotalAmount())
                .deliveryCharge(order.getDeliveryCharge())
                .grandTotal(order.getGrandTotal())
                .status(order.getStatus())
                .specialInstructions(order.getSpecialInstructions())
                .payment(order.getPayment() != null ? PaymentResponse.fromEntity(order.getPayment()) : null)
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }
}
