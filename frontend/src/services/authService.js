import api from './api';

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const authService = {
  // Register new user (customer or owner)
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Login user and store token
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const responseData = response.data;
    
    // Backend wraps response in ApiResponse: { success, message, data: { token, tokenType, user } }
    const authData = responseData.data || responseData;
    const token = authData.token || authData.accessToken || authData.jwt || (typeof authData === 'string' ? authData : null);

    if (token) {
      localStorage.setItem('token', token);
      const decoded = decodeJwt(token);
      const authUser = authData.user || {};
      const user = {
        id: authUser.id || authData.id || (decoded && (decoded.id || decoded.userId || decoded.sub)),
        email: authUser.email || authData.email || (decoded && (decoded.email || decoded.sub)),
        fullName: authUser.fullName || authUser.name || authData.fullName || (decoded && (decoded.name || decoded.fullName)),
        name: authUser.fullName || authUser.name || authData.fullName || (decoded && (decoded.name || decoded.fullName)),
        role: authUser.role || authData.role || (decoded && (decoded.role || (decoded.roles && decoded.roles[0]))),
        phone: authUser.phone || authData.phone || (decoded && decoded.phone),
      };
      localStorage.setItem('user', JSON.stringify(user));
      return { token, user };
    }
    return responseData;
  },

  // Get current logged-in user from token/localStorage
  getCurrentUser: () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const decoded = decodeJwt(token);
    if (!decoded) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    // Check if token has expired
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return null;
    }

    const storedUser = localStorage.getItem('user');
    let user = null;
    if (storedUser) {
      try {
        user = JSON.parse(storedUser);
      } catch (e) {
        user = null;
      }
    }

    if (!user) {
      user = {
        id: decoded.id || decoded.userId || decoded.sub,
        email: decoded.email || decoded.sub,
        name: decoded.name || decoded.fullName || decoded.sub,
        role: decoded.role || (decoded.roles && decoded.roles[0]) || 'CUSTOMER',
      };
    }

    return user;
  },

  // Logout current user
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if token exists and is valid
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decoded = decodeJwt(token);
    if (!decoded) return false;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) return false;
    return true;
  },
};

export default authService;
