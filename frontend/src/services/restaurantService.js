import api from './api';

const restaurantService = {
  // Get all active restaurants
  getAllRestaurants: async () => {
    const response = await api.get('/restaurants');
    return response.data;
  },

  // Get restaurant by ID
  getRestaurantById: async (id) => {
    const response = await api.get(`/restaurants/${id}`);
    return response.data;
  },

  // Search restaurants by keyword (name, cuisine, address)
  searchRestaurants: async (query) => {
    const response = await api.get('/restaurants/search', {
      params: { query },
    });
    return response.data;
  },

  // Get restaurant owned by current authenticated owner
  getOwnerRestaurant: async () => {
    const response = await api.get('/restaurants/owner');
    return response.data;
  },

  // Create restaurant
  createRestaurant: async (data) => {
    const response = await api.post('/restaurants', data);
    return response.data;
  },

  // Update restaurant details
  updateRestaurant: async (id, data) => {
    const response = await api.put(`/restaurants/${id}`, data);
    return response.data;
  },

  // Toggle restaurant active status
  toggleStatus: async (id) => {
    const response = await api.patch(`/restaurants/${id}/status`);
    return response.data;
  },
};

export default restaurantService;
