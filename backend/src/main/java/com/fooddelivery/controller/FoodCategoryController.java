package com.fooddelivery.controller;

import com.fooddelivery.dto.request.FoodCategoryRequest;
import com.fooddelivery.dto.response.ApiResponse;
import com.fooddelivery.dto.response.FoodCategoryResponse;
import com.fooddelivery.service.FoodCategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class FoodCategoryController {

    private final FoodCategoryService foodCategoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodCategoryResponse>>> getAllCategories() {
        List<FoodCategoryResponse> categories = foodCategoryService.getAllCategories();
        return ResponseEntity.ok(ApiResponse.success("Categories retrieved successfully", categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodCategoryResponse>> getCategoryById(@PathVariable Long id) {
        FoodCategoryResponse category = foodCategoryService.getCategoryById(id);
        return ResponseEntity.ok(ApiResponse.success("Category retrieved successfully", category));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodCategoryResponse>> createCategory(@Valid @RequestBody FoodCategoryRequest request) {
        FoodCategoryResponse category = foodCategoryService.createCategory(request);
        return new ResponseEntity<>(
                ApiResponse.success("Category created successfully", category),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<FoodCategoryResponse>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody FoodCategoryRequest request) {
        FoodCategoryResponse category = foodCategoryService.updateCategory(id, request);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", category));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        foodCategoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
    }
}
