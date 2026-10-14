package com.fooddelivery.dto.response;

import com.fooddelivery.entity.FoodItem;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodItemResponse {

    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String imageUrl;
    private boolean isAvailable;
    private boolean isVegetarian;
    private String categoryName;
    private Long categoryId;
    private String restaurantName;
    private Long restaurantId;
    private LocalDateTime createdAt;

    public static FoodItemResponse fromEntity(FoodItem foodItem) {
        if (foodItem == null) {
            return null;
        }
        return FoodItemResponse.builder()
                .id(foodItem.getId())
                .name(foodItem.getName())
                .description(foodItem.getDescription())
                .price(foodItem.getPrice())
                .imageUrl(foodItem.getImageUrl())
                .isAvailable(foodItem.isAvailable())
                .isVegetarian(foodItem.isVegetarian())
                .categoryName(foodItem.getCategory() != null ? foodItem.getCategory().getName() : null)
                .categoryId(foodItem.getCategory() != null ? foodItem.getCategory().getId() : null)
                .restaurantName(foodItem.getRestaurant() != null ? foodItem.getRestaurant().getName() : null)
                .restaurantId(foodItem.getRestaurant() != null ? foodItem.getRestaurant().getId() : null)
                .createdAt(foodItem.getCreatedAt())
                .build();
    }
}
