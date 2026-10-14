package com.fooddelivery.service;

import com.fooddelivery.dto.request.FoodCategoryRequest;
import com.fooddelivery.dto.response.FoodCategoryResponse;
import com.fooddelivery.entity.FoodCategory;
import com.fooddelivery.exception.BadRequestException;
import com.fooddelivery.exception.ResourceNotFoundException;
import com.fooddelivery.repository.FoodCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodCategoryService {

    private final FoodCategoryRepository foodCategoryRepository;

    @Transactional(readOnly = true)
    public List<FoodCategoryResponse> getAllCategories() {
        return foodCategoryRepository.findAll().stream()
                .map(FoodCategoryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FoodCategoryResponse getCategoryById(Long id) {
        FoodCategory category = foodCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodCategory", "id", id));
        return FoodCategoryResponse.fromEntity(category);
    }

    @Transactional
    public FoodCategoryResponse createCategory(FoodCategoryRequest request) {
        foodCategoryRepository.findByNameIgnoreCase(request.getName().trim())
                .ifPresent(c -> {
                    throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
                });

        FoodCategory category = FoodCategory.builder()
                .name(request.getName().trim())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .build();

        FoodCategory saved = foodCategoryRepository.save(category);
        return FoodCategoryResponse.fromEntity(saved);
    }

    @Transactional
    public FoodCategoryResponse updateCategory(Long id, FoodCategoryRequest request) {
        FoodCategory category = foodCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodCategory", "id", id));

        foodCategoryRepository.findByNameIgnoreCase(request.getName().trim())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new BadRequestException("Category with name '" + request.getName() + "' already exists");
                    }
                });

        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        FoodCategory updated = foodCategoryRepository.save(category);
        return FoodCategoryResponse.fromEntity(updated);
    }

    @Transactional
    public void deleteCategory(Long id) {
        FoodCategory category = foodCategoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FoodCategory", "id", id));
        foodCategoryRepository.delete(category);
    }
}
