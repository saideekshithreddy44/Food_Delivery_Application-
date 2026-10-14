package com.fooddelivery.dto.response;

import com.fooddelivery.entity.FoodCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodCategoryResponse {

    private Long id;
    private String name;
    private String description;
    private String imageUrl;

    public static FoodCategoryResponse fromEntity(FoodCategory category) {
        if (category == null) {
            return null;
        }
        return FoodCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }
}
