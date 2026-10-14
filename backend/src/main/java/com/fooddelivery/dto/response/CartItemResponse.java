package com.fooddelivery.dto.response;

import com.fooddelivery.entity.CartItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItemResponse {

    private Long id;
    private FoodItemResponse foodItem;
    private Integer quantity;
    private BigDecimal totalPrice;
    private String restaurantName;
    private Long restaurantId;

    public static CartItemResponse fromEntity(CartItem cartItem) {
        if (cartItem == null) {
            return null;
        }
        FoodItemResponse itemResponse = cartItem.getFoodItem() != null
                ? FoodItemResponse.fromEntity(cartItem.getFoodItem())
                : null;

        String restName = null;
        Long restId = null;
        if (cartItem.getFoodItem() != null && cartItem.getFoodItem().getRestaurant() != null) {
            restName = cartItem.getFoodItem().getRestaurant().getName();
            restId = cartItem.getFoodItem().getRestaurant().getId();
        }

        return CartItemResponse.builder()
                .id(cartItem.getId())
                .foodItem(itemResponse)
                .quantity(cartItem.getQuantity())
                .totalPrice(cartItem.getTotalPrice())
                .restaurantName(restName)
                .restaurantId(restId)
                .build();
    }
}
