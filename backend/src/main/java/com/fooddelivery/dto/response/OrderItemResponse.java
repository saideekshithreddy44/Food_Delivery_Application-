package com.fooddelivery.dto.response;

import com.fooddelivery.entity.OrderItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItemResponse {

    private Long id;
    private String foodName;
    private BigDecimal foodPrice;
    private Integer quantity;
    private BigDecimal totalPrice;
    private Long foodItemId;

    public static OrderItemResponse fromEntity(OrderItem orderItem) {
        if (orderItem == null) {
            return null;
        }
        return OrderItemResponse.builder()
                .id(orderItem.getId())
                .foodName(orderItem.getFoodName())
                .foodPrice(orderItem.getFoodPrice())
                .quantity(orderItem.getQuantity())
                .totalPrice(orderItem.getTotalPrice())
                .foodItemId(orderItem.getFoodItem() != null ? orderItem.getFoodItem().getId() : null)
                .build();
    }
}
