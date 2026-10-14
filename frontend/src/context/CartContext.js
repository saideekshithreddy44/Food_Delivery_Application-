import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, isCustomer } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Calculate total count of items in the cart
  const cartCount = React.useMemo(() => {
    if (!cart) return 0;
    const items = cart.items || cart.cartItems || [];
    return items.reduce((total, item) => total + (item.quantity || 1), 0);
  }, [cart]);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated || !isCustomer) {
      setCart(null);
      return;
    }
    setLoading(true);
    try {
      const data = await cartService.getCart();
      setCart(data);
    } catch (err) {
      // If 404 or empty, cart might not be initialized yet
      console.warn('Could not fetch cart:', err?.response?.data?.message || err.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isCustomer]);

  // Fetch cart whenever auth status changes
  useEffect(() => {
    if (isAuthenticated && isCustomer) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, isCustomer, fetchCart]);

  // Add item to cart
  const addToCart = async (foodItemId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.info('Please log in to add items to your cart.');
      return false;
    }
    try {
      const updatedCart = await cartService.addToCart({ foodItemId, quantity });
      setCart(updatedCart);
      toast.success('Added to cart! 🛒');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Failed to add item to cart';
      toast.error(typeof msg === 'string' ? msg : 'Error adding item');
      return false;
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId, quantity) => {
    if (quantity <= 0) {
      return removeItem(cartItemId);
    }
    try {
      const updatedCart = await cartService.updateQuantity(cartItemId, quantity);
      setCart(updatedCart);
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update quantity';
      toast.error(msg);
      return false;
    }
  };

  // Remove single item from cart
  const removeItem = async (cartItemId) => {
    try {
      const updatedCart = await cartService.removeFromCart(cartItemId);
      setCart(updatedCart);
      toast.info('Item removed from cart');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      toast.error(msg);
      return false;
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      toast.info('Cart cleared');
      return true;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to clear cart';
      toast.error(msg);
      return false;
    }
  };

  const value = {
    cart,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    setCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
