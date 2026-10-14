import api from './api';

const orderService = {
  // Place a new order
  placeOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  // Get orders for the logged-in customer
  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  // Get order by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel an order (customer or owner)
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },

  // Get orders for current restaurant owner
  getRestaurantOrders: async () => {
    const response = await api.get('/orders/restaurant');
    return response.data;
  },

  // Update order status (PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED)
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  // Get all orders across the platform (Admin)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
};

export default orderService;
