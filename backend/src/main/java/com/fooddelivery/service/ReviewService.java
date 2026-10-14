package com.fooddelivery.service;

import com.fooddelivery.dto.request.ReviewRequest;
import com.fooddelivery.dto.response.ReviewResponse;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.Review;
import com.fooddelivery.entity.User;
import com.fooddelivery.enums.UserRole;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.ReviewRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional
    public ReviewResponse addReview(String email, ReviewRequest request) {
        User user = getUserByEmail(email);

        Restaurant restaurant = restaurantRepository.findById(request.getRestaurantId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));

        if (reviewRepository.existsByUserIdAndRestaurantId(user.getId(), restaurant.getId())) {
            throw new BadRequestException("You have already reviewed this restaurant");
        }

        Review review = Review.builder()
                .rating(request.getRating())
                .comment(request.getComment())
                .user(user)
                .restaurant(restaurant)
                .build();

        Review savedReview = reviewRepository.save(review);

        // Recalculate restaurant rating
        recalculateRestaurantRating(restaurant);

        return ReviewResponse.fromEntity(savedReview);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getRestaurantReviews(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));

        return reviewRepository.findByRestaurantId(restaurantId).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getUserReviews(String email) {
        User user = getUserByEmail(email);
        return reviewRepository.findByUserId(user.getId()).stream()
                .map(ReviewResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteReview(String email, Long reviewId) {
        User user = getUserByEmail(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));

        boolean isAuthor = review.getUser().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to delete this review");
        }

        Restaurant restaurant = review.getRestaurant();
        reviewRepository.delete(review);

        // Recalculate restaurant rating
        recalculateRestaurantRating(restaurant);
    }

    private void recalculateRestaurantRating(Restaurant restaurant) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurant.getId());
        if (reviews.isEmpty()) {
            restaurant.setRating(0.0);
            restaurant.setTotalRatings(0);
        } else {
            double avg = reviews.stream()
                    .mapToInt(Review::getRating)
                    .average()
                    .orElse(0.0);
            double roundedAvg = Math.round(avg * 10.0) / 10.0;
            restaurant.setRating(roundedAvg);
            restaurant.setTotalRatings(reviews.size());
        }
        restaurantRepository.save(restaurant);
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
