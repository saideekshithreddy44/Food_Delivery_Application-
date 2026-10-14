package com.fooddelivery.controller;

import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.FoodItemResponse;
import com.fooddelivery.dto.response.RestaurantResponse;
import com.fooddelivery.service.FoodItemService;
import com.fooddelivery.service.RestaurantService;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final RestaurantService restaurantService;
    private final FoodItemService foodItemService;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchResultResponse {
        private List<RestaurantResponse> restaurants;
        private List<FoodItemResponse> foodItems;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SearchResultResponse>> search(@RequestParam(name = "q", required = false) String query) {
        List<RestaurantResponse> restaurants = restaurantService.searchRestaurants(query);
        List<FoodItemResponse> foodItems = foodItemService.searchFoodItems(query, null, null, null, null);

        SearchResultResponse response = SearchResultResponse.builder()
                .restaurants(restaurants)
                .foodItems(foodItems)
                .build();

        return ResponseEntity.ok(ApiResponse.success("Search completed successfully", response));
    }
}
