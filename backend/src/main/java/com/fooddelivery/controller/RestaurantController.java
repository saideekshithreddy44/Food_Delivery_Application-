package com.fooddelivery.controller;

import com.fooddelivery.dto.request.RestaurantRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.RestaurantResponse;
import com.fooddelivery.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    // --- Public Endpoints ---

    @GetMapping("/api/restaurants")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> getAllActiveRestaurants() {
        List<RestaurantResponse> restaurants = restaurantService.getAllActiveRestaurants();
        return ResponseEntity.ok(ApiResponse.success("Restaurants retrieved successfully", restaurants));
    }

    @GetMapping("/api/restaurants/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getRestaurantById(@PathVariable Long id) {
        RestaurantResponse restaurant = restaurantService.getRestaurantById(id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant retrieved successfully", restaurant));
    }

    @GetMapping("/api/restaurants/search")
    public ResponseEntity<ApiResponse<List<RestaurantResponse>>> searchRestaurants(@RequestParam(name = "q", required = false) String query) {
        List<RestaurantResponse> restaurants = restaurantService.searchRestaurants(query);
        return ResponseEntity.ok(ApiResponse.success("Restaurants search completed successfully", restaurants));
    }

    // --- Owner Endpoints ---

    @PostMapping("/api/owner/restaurants")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN', 'CUSTOMER')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> createRestaurant(@Valid @RequestBody RestaurantRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RestaurantResponse response = restaurantService.createRestaurant(email, request);
        return new ResponseEntity<>(
                ApiResponse.success("Restaurant created successfully", response),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/api/owner/restaurants/{id}")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> updateRestaurant(
            @PathVariable Long id,
            @Valid @RequestBody RestaurantRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RestaurantResponse response = restaurantService.updateRestaurant(email, id, request);
        return ResponseEntity.ok(ApiResponse.success("Restaurant updated successfully", response));
    }

    @GetMapping("/api/owner/restaurants/my-restaurant")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> getMyRestaurant() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RestaurantResponse response = restaurantService.getOwnerRestaurant(email);
        return ResponseEntity.ok(ApiResponse.success("Owner restaurant retrieved successfully", response));
    }

    @PatchMapping("/api/owner/restaurants/{id}/toggle-status")
    @PreAuthorize("hasAnyRole('RESTAURANT_OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponse>> toggleRestaurantStatus(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        RestaurantResponse response = restaurantService.toggleRestaurantStatus(email, id);
        return ResponseEntity.ok(ApiResponse.success("Restaurant status toggled successfully", response));
    }
}
