import api from './api';

const reviewService = {
  // Add a review for a restaurant
  addReview: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },

  // Get all reviews for a specific restaurant
  getRestaurantReviews: async (restaurantId) => {
    const response = await api.get(`/reviews/restaurant/${restaurantId}`);
    return response.data;
  },

  // Get reviews submitted by current user
  getMyReviews: async () => {
    const response = await api.get('/reviews/my-reviews');
    return response.data;
  },

  // Delete a review
  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

export default reviewService;
