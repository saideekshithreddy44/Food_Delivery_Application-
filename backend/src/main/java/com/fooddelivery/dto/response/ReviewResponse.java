package com.fooddelivery.dto.response;

import com.fooddelivery.entity.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewResponse {

    private Long id;
    private Integer rating;
    private String comment;
    private String userName;
    private Long userId;
    private String restaurantName;
    private Long restaurantId;
    private LocalDateTime createdAt;

    public static ReviewResponse fromEntity(Review review) {
        if (review == null) {
            return null;
        }
        return ReviewResponse.builder()
                .id(review.getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .userName(review.getUser() != null ? review.getUser().getFullName() : null)
                .userId(review.getUser() != null ? review.getUser().getId() : null)
                .restaurantName(review.getRestaurant() != null ? review.getRestaurant().getName() : null)
                .restaurantId(review.getRestaurant() != null ? review.getRestaurant().getId() : null)
                .createdAt(review.getCreatedAt())
                .build();
    }
}
