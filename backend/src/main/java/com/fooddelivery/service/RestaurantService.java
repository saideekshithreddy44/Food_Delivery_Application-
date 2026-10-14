package com.fooddelivery.service;

import com.fooddelivery.dto.request.RestaurantRequest;
import com.fooddelivery.dto.response.RestaurantResponse;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.enums.UserRole;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllActiveRestaurants() {
        return restaurantRepository.findByIsActiveTrue().stream()
                .map(RestaurantResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getRestaurantById(Long id) {
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));
        return RestaurantResponse.fromEntity(restaurant);
    }

    @Transactional(readOnly = true)
    public RestaurantResponse getOwnerRestaurant(String email) {
        User user = getUserByEmail(email);
        Restaurant restaurant = restaurantRepository.findByOwnerId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "ownerId", user.getId()));
        return RestaurantResponse.fromEntity(restaurant);
    }

    @Transactional
    public RestaurantResponse createRestaurant(String email, RestaurantRequest request) {
        User user = getUserByEmail(email);

        if (restaurantRepository.findByOwnerId(user.getId()).isPresent()) {
            throw new BadRequestException("User already owns a restaurant");
        }

        if (user.getRole() != UserRole.RESTAURANT_OWNER && user.getRole() != UserRole.ADMIN) {
            user.setRole(UserRole.RESTAURANT_OWNER);
            userRepository.save(user);
        }

        Restaurant restaurant = Restaurant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .cuisineType(request.getCuisineType())
                .address(request.getAddress())
                .phone(request.getPhone())
                .email(request.getEmail() != null ? request.getEmail() : user.getEmail())
                .imageUrl(request.getImageUrl())
                .openingTime(request.getOpeningTime())
                .closingTime(request.getClosingTime())
                .isActive(true)
                .rating(0.0)
                .totalRatings(0)
                .owner(user)
                .build();

        Restaurant savedRestaurant = restaurantRepository.save(restaurant);
        return RestaurantResponse.fromEntity(savedRestaurant);
    }

    @Transactional
    public RestaurantResponse updateRestaurant(String email, Long id, RestaurantRequest request) {
        User user = getUserByEmail(email);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));

        boolean isOwner = restaurant.getOwner() != null && restaurant.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to update this restaurant");
        }

        restaurant.setName(request.getName());
        restaurant.setDescription(request.getDescription());
        restaurant.setCuisineType(request.getCuisineType());
        restaurant.setAddress(request.getAddress());
        restaurant.setPhone(request.getPhone());
        restaurant.setEmail(request.getEmail());
        restaurant.setImageUrl(request.getImageUrl());
        restaurant.setOpeningTime(request.getOpeningTime());
        restaurant.setClosingTime(request.getClosingTime());

        Restaurant updated = restaurantRepository.save(restaurant);
        return RestaurantResponse.fromEntity(updated);
    }

    @Transactional
    public RestaurantResponse toggleRestaurantStatus(String email, Long id) {
        User user = getUserByEmail(email);
        Restaurant restaurant = restaurantRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", id));

        boolean isOwner = restaurant.getOwner() != null && restaurant.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to modify this restaurant");
        }

        boolean currentStatus = restaurant.getIsActive() != null ? restaurant.getIsActive() : true;
        restaurant.setIsActive(!currentStatus);

        Restaurant updated = restaurantRepository.save(restaurant);
        return RestaurantResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> getAllRestaurants() {
        return restaurantRepository.findAll().stream()
                .map(RestaurantResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RestaurantResponse> searchRestaurants(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllActiveRestaurants();
        }
        String cleanQuery = query.trim();
        return restaurantRepository.findByNameContainingIgnoreCaseOrCuisineTypeContainingIgnoreCase(cleanQuery, cleanQuery).stream()
                .filter(r -> Boolean.TRUE.equals(r.getIsActive()))
                .map(RestaurantResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
