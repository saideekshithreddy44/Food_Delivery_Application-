import api from './api';

const cartService = {
  // Get active cart for current user
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (data) => {
    // Accepts { foodItemId, quantity } or foodItemId directly
    const payload = typeof data === 'object' ? data : { foodItemId: data, quantity: 1 };
    const response = await api.post('/cart/items', payload);
    return response.data;
  },

  // Update item quantity in cart
  updateQuantity: async (cartItemId, quantity) => {
    const response = await api.put(`/cart/items/${cartItemId}`, { quantity });
    return response.data;
  },

  // Remove single item from cart
  removeFromCart: async (cartItemId) => {
    const response = await api.delete(`/cart/items/${cartItemId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

export default cartService;
