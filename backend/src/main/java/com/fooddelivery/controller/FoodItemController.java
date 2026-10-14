package com.fooddelivery.controller;

import com.fooddelivery.dto.request.FoodItemRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.FoodItemResponse;
import com.fooddelivery.service.FoodItemService;
import com.fooddelivery.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class FoodItemController {

    private final FoodItemService foodItemService;
    private final RestaurantService restaurantService;

    // --- Public Endpoints ---

    @GetMapping("/api/restaurants/{restaurantId}/food-items")
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getAvailableFoodItemsByRestaurant(
            @PathVariable Long restaurantId) {
        List<FoodItemResponse> items = foodItemService.getFoodItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Food items retrieved successfully", items));
    }

    @GetMapping("/api/food-items/{id}")
    public ResponseEntity<ApiResponse<FoodItemResponse>> getFoodItemById(@PathVariable Long id) {
        FoodItemResponse item = foodItemService.getFoodItemById(id);
        return ResponseEntity.ok(ApiResponse.success("Food item retrieved successfully", item));
    }

    // --- Owner Endpoints ---

    @PostMapping("/api/owner/food-items")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> createFoodItem(
            @Valid @RequestBody FoodItemRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        FoodItemResponse response = foodItemService.createFoodItem(email, request);
        return new ResponseEntity<>(
                ApiResponse.success("Food item created successfully", response),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/api/owner/food-items/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> updateFoodItem(
            @PathVariable Long id,
            @Valid @RequestBody FoodItemRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        FoodItemResponse response = foodItemService.updateFoodItem(email, id, request);
        return ResponseEntity.ok(ApiResponse.success("Food item updated successfully", response));
    }

    @DeleteMapping("/api/owner/food-items/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFoodItem(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        foodItemService.deleteFoodItem(email, id);
        return ResponseEntity.ok(ApiResponse.success("Food item deleted successfully", null));
    }

    @PatchMapping("/api/owner/food-items/{id}/toggle-availability")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodItemResponse>> toggleAvailability(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        FoodItemResponse response = foodItemService.toggleAvailability(email, id);
        return ResponseEntity.ok(ApiResponse.success("Food item availability toggled successfully", response));
    }

    @GetMapping("/api/owner/food-items")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> getOwnerFoodItems() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        Long restaurantId = restaurantService.getOwnerRestaurant(email).getId();
        List<FoodItemResponse> items = foodItemService.getAllFoodItemsByRestaurant(restaurantId);
        return ResponseEntity.ok(ApiResponse.success("Owner food items retrieved successfully", items));
    }

    // --- Search Endpoint ---

    @GetMapping("/api/search/food-items")
    public ResponseEntity<ApiResponse<List<FoodItemResponse>>> searchFoodItems(
            @RequestParam(name = "q", required = false) String query,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "restaurantId", required = false) Long restaurantId,
            @RequestParam(name = "minPrice", required = false) BigDecimal minPrice,
            @RequestParam(name = "maxPrice", required = false) BigDecimal maxPrice) {
        List<FoodItemResponse> items = foodItemService.searchFoodItems(query, categoryId, restaurantId, minPrice, maxPrice);
        return ResponseEntity.ok(ApiResponse.success("Food items search completed successfully", items));
    }
}
