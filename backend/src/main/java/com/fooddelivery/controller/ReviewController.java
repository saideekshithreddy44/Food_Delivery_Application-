package com.fooddelivery.controller;

import com.fooddelivery.dto.request.ReviewRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.ReviewResponse;
import com.fooddelivery.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ApiResponse<ReviewResponse>> addReview(@Valid @RequestBody ReviewRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReviewResponse response = reviewService.addReview(email, request);
        return new ResponseEntity<>(
                ApiResponse.success("Review added successfully", response),
                HttpStatus.CREATED
        );
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getRestaurantReviews(@PathVariable Long restaurantId) {
        List<ReviewResponse> reviews = reviewService.getRestaurantReviews(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Restaurant reviews retrieved successfully", reviews));
    }

    @GetMapping("/my-reviews")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getMyReviews() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        List<ReviewResponse> reviews = reviewService.getUserReviews(email);
        return ResponseEntity.ok(ApiResponse.success("User reviews retrieved successfully", reviews));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        reviewService.deleteReview(email, id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted successfully", null));
    }
}
