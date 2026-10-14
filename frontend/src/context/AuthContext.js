import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage/token on load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      if (storedToken && authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setToken(storedToken);
      } else {
        authService.logout();
        setUser(null);
        setToken(null);
      }
    } catch (err) {
      console.error('Failed to initialize auth:', err);
      authService.logout();
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login({ email, password });
      const currentToken = localStorage.getItem('token') || (result && result.token);
      const currentUser = authService.getCurrentUser();
      setToken(currentToken);
      setUser(currentUser);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const result = await authService.register(userData);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const isAuthenticated = Boolean(token && user);

  // Role checking helpers (handles both with and without ROLE_ prefix)
  const userRole = user?.role ? user.role.toUpperCase() : '';
  const isCustomer = userRole === 'CUSTOMER' || userRole === 'ROLE_CUSTOMER';
  const isOwner =
    userRole === 'RESTAURANT_OWNER' ||
    userRole === 'ROLE_RESTAURANT_OWNER' ||
    userRole === 'OWNER' ||
    userRole === 'ROLE_OWNER';
  const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';

  const value = {
    user,
    token,
    loading,
    isAuthenticated,
    isCustomer,
    isOwner,
    isAdmin,
    login,
    register,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
