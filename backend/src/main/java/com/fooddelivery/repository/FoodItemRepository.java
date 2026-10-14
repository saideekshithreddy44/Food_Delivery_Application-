package com.fooddelivery.repository;

import com.fooddelivery.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {

    List<FoodItem> findByRestaurantId(Long restaurantId);

    List<FoodItem> findByRestaurantIdAndIsAvailableTrue(Long restaurantId);

    List<FoodItem> findByCategoryId(Long categoryId);

    List<FoodItem> findByNameContainingIgnoreCase(String name);

    List<FoodItem> findByIsAvailableTrue();

    List<FoodItem> findByRestaurantIdAndCategoryId(Long restaurantId, Long categoryId);

    List<FoodItem> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
}
