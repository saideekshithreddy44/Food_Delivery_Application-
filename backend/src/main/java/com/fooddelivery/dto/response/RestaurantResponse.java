package com.fooddelivery.dto.response;

import com.fooddelivery.entity.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantResponse {

    private Long id;
    private String name;
    private String description;
    private String cuisineType;
    private String address;
    private String phone;
    private String email;
    private String imageUrl;
    private String openingTime;
    private String closingTime;
    private boolean isActive;
    private Double rating;
    private Integer totalRatings;
    private String ownerName;
    private LocalDateTime createdAt;

    public static RestaurantResponse fromEntity(Restaurant restaurant) {
        if (restaurant == null) {
            return null;
        }
        return RestaurantResponse.builder()
                .id(restaurant.getId())
                .name(restaurant.getName())
                .description(restaurant.getDescription())
                .cuisineType(restaurant.getCuisineType())
                .address(restaurant.getAddress())
                .phone(restaurant.getPhone())
                .email(restaurant.getEmail())
                .imageUrl(restaurant.getImageUrl())
                .openingTime(restaurant.getOpeningTime())
                .closingTime(restaurant.getClosingTime())
                .isActive(restaurant.getIsActive() != null ? restaurant.getIsActive() : true)
                .rating(restaurant.getRating() != null ? restaurant.getRating() : 0.0)
                .totalRatings(restaurant.getTotalRatings() != null ? restaurant.getTotalRatings() : 0)
                .ownerName(restaurant.getOwner() != null ? restaurant.getOwner().getFullName() : null)
                .createdAt(restaurant.getCreatedAt())
                .build();
    }
}
