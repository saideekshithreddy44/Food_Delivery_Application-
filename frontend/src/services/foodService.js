import api from './api';

const foodService = {
  // Get food items by restaurant ID
  getFoodItemsByRestaurant: async (restaurantId) => {
    const response = await api.get(`/food-items/restaurant/${restaurantId}`);
    return response.data;
  },

  // Get all food categories
  getAllCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Search food items by keyword or filters
  searchFoodItems: async (params) => {
    const response = await api.get('/food-items/search', { params });
    return response.data;
  },

  // Create a new food item
  createFoodItem: async (data) => {
    const response = await api.post('/food-items', data);
    return response.data;
  },

  // Update an existing food item
  updateFoodItem: async (id, data) => {
    const response = await api.put(`/food-items/${id}`, data);
    return response.data;
  },

  // Delete a food item
  deleteFoodItem: async (id) => {
    const response = await api.delete(`/food-items/${id}`);
    return response.data;
  },

  // Toggle food item availability
  toggleAvailability: async (id) => {
    const response = await api.patch(`/food-items/${id}/availability`);
    return response.data;
  },

  // Get all food items for current restaurant owner
  getOwnerFoodItems: async () => {
    const response = await api.get('/food-items/owner');
    return response.data;
  },

  // Create a new food category (Admin only)
  createCategory: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },

  // Delete a food category (Admin only)
  deleteCategory: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export default foodService;
