import api from './api';

const userService = {
  // Get current user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update current user profile
  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Get user's saved delivery addresses
  getAddresses: async () => {
    const response = await api.get('/users/addresses');
    return response.data;
  },

  // Add a new delivery address
  addAddress: async (data) => {
    const response = await api.post('/users/addresses', data);
    return response.data;
  },

  // Update an existing address
  updateAddress: async (id, data) => {
    const response = await api.put(`/users/addresses/${id}`, data);
    return response.data;
  },

  // Delete an address
  deleteAddress: async (id) => {
    const response = await api.delete(`/users/addresses/${id}`);
    return response.data;
  },

  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // Delete a user (Admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  // Get dashboard statistics (Admin / Summary)
  getDashboard: async () => {
    const response = await api.get('/users/dashboard');
    return response.data;
  },
};

export default userService;
