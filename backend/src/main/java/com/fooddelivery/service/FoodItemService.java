package com.fooddelivery.service;

import com.fooddelivery.dto.request.FoodItemRequest;
import com.fooddelivery.dto.response.FoodItemResponse;
import com.fooddelivery.entity.FoodCategory;
import com.fooddelivery.entity.FoodItem;
import com.fooddelivery.entity.Restaurant;
import com.fooddelivery.entity.User;
import com.fooddelivery.enums.UserRole;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.exception.UnauthorizedException;
import com.fooddelivery.repository.FoodCategoryRepository;
import com.fooddelivery.repository.FoodItemRepository;
import com.fooddelivery.repository.RestaurantRepository;
import com.fooddelivery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodItemService {

    private final FoodItemRepository foodItemRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodCategoryRepository foodCategoryRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<FoodItemResponse> getFoodItemsByRestaurant(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));

        return foodItemRepository.findByRestaurantIdAndIsAvailableTrue(restaurantId).stream()
                .map(FoodItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FoodItemResponse> getAllFoodItemsByRestaurant(Long restaurantId) {
        restaurantRepository.findById(restaurantId)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", restaurantId));

        return foodItemRepository.findByRestaurantId(restaurantId).stream()
                .map(FoodItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodItemResponse getFoodItemById(Long id) {
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", id));
        return FoodItemResponse.fromEntity(foodItem);
    }

    @Transactional
    public FoodItemResponse createFoodItem(String email, FoodItemRequest request) {
        User user = getUserByEmail(email);

        Restaurant restaurant;
        if (request.getRestaurantId() != null && user.getRole() == UserRole.ADMIN) {
            restaurant = restaurantRepository.findById(request.getRestaurantId())
                    .orElseThrow(() -> new ResourceNotFoundException("Restaurant", "id", request.getRestaurantId()));
        } else {
            restaurant = restaurantRepository.findByOwnerId(user.getId())
                    .orElseThrow(() -> new BadRequestException("You do not own any restaurant to add food items to"));
        }

        FoodCategory category = foodCategoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("FoodCategory", "id", request.getCategoryId()));

        FoodItem foodItem = FoodItem.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .price(request.getPrice())
                .imageUrl(request.getImageUrl())
                .isAvailable(request.getIsAvailable() != null ? request.getIsAvailable() : true)
                .isVegetarian(request.getIsVegetarian() != null ? request.getIsVegetarian() : false)
                .restaurant(restaurant)
                .category(category)
                .build();

        FoodItem saved = foodItemRepository.save(foodItem);
        return FoodItemResponse.fromEntity(saved);
    }

    @Transactional
    public FoodItemResponse updateFoodItem(String email, Long id, FoodItemRequest request) {
        User user = getUserByEmail(email);
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", id));

        validateOwnership(user, foodItem.getRestaurant());

        if (request.getCategoryId() != null) {
            FoodCategory category = foodCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("FoodCategory", "id", request.getCategoryId()));
            foodItem.setCategory(category);
        }

        foodItem.setName(request.getName().trim());
        foodItem.setDescription(request.getDescription());
        foodItem.setPrice(request.getPrice());
        foodItem.setImageUrl(request.getImageUrl());
        if (request.getIsAvailable() != null) {
            foodItem.setAvailable(request.getIsAvailable());
        }
        if (request.getIsVegetarian() != null) {
            foodItem.setVegetarian(request.getIsVegetarian());
        }

        FoodItem updated = foodItemRepository.save(foodItem);
        return FoodItemResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteFoodItem(String email, Long id) {
        User user = getUserByEmail(email);
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", id));

        validateOwnership(user, foodItem.getRestaurant());

        foodItemRepository.delete(foodItem);
    }

    @Transactional
    public FoodItemResponse toggleAvailability(String email, Long id) {
        User user = getUserByEmail(email);
        FoodItem foodItem = foodItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodItem", "id", id));

        validateOwnership(user, foodItem.getRestaurant());

        foodItem.setAvailable(!foodItem.isAvailable());
        FoodItem updated = foodItemRepository.save(foodItem);
        return FoodItemResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<FoodItemResponse> searchFoodItems(
            String query,
            Long categoryId,
            Long restaurantId,
            BigDecimal minPrice,
            BigDecimal maxPrice) {

        List<FoodItem> items = foodItemRepository.findAll();

        return items.stream()
                .filter(item -> {
                    // Check text query (name or description)
                    if (query != null && !query.trim().isEmpty()) {
                        String lowerQuery = query.trim().toLowerCase();
                        boolean nameMatch = item.getName() != null && item.getName().toLowerCase().contains(lowerQuery);
                        boolean descMatch = item.getDescription() != null && item.getDescription().toLowerCase().contains(lowerQuery);
                        if (!nameMatch && !descMatch) {
                            return false;
                        }
                    }

                    // Check category
                    if (categoryId != null) {
                        if (item.getCategory() == null || !categoryId.equals(item.getCategory().getId())) {
                            return false;
                        }
                    }

                    // Check restaurant
                    if (restaurantId != null) {
                        if (item.getRestaurant() == null || !restaurantId.equals(item.getRestaurant().getId())) {
                            return false;
                        }
                    }

                    // Check min price
                    if (minPrice != null && item.getPrice() != null) {
                        if (item.getPrice().compareTo(minPrice) < 0) {
                            return false;
                        }
                    }

                    // Check max price
                    if (maxPrice != null && item.getPrice() != null) {
                        if (item.getPrice().compareTo(maxPrice) > 0) {
                            return false;
                        }
                    }

                    return true;
                })
                .map(FoodItemResponse::fromEntity)
                .collect(Collectors.toList());
    }

    private void validateOwnership(User user, Restaurant restaurant) {
        boolean isOwner = restaurant.getOwner() != null && restaurant.getOwner().getId().equals(user.getId());
        boolean isAdmin = user.getRole() == UserRole.ADMIN;
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to manage food items for this restaurant");
        }
    }

    private User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }
}
