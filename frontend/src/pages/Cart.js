import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaArrowRight, FaArrowLeft, FaCheckCircle, FaShoppingBag } from 'react-icons/fa';
import CartItemCard from '../components/CartItemCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const items = cart?.items || cart?.cartItems || [];

  // Calculate pricing breakdown
  const subtotal = items.reduce((sum, item) => {
    const price = item.foodItem?.price || item.price || 0;
    const qty = item.quantity || 1;
    return sum + price * qty;
  }, 0);

  const deliveryCharge = items.length > 0 ? 40 : 0;
  const platformFee = items.length > 0 ? 10 : 0;
  const grandTotal = subtotal + deliveryCharge + platformFee;

  if (loading) {
    return <LoadingSpinner text="Fetching your cart..." />;
  }

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2 className="empty-state-title">Your cart is empty</h2>
          <p className="empty-state-text">
            Looks like you haven't added anything to your cart yet. Explore our top restaurants and satisfy your cravings!
          </p>
          <Link to="/restaurants" className="btn btn-primary btn-lg">
            <FaShoppingBag /> Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="page-header">
        <h1 className="page-title">Shopping Cart 🛒</h1>
        <p className="page-subtitle">Review your selected items before checking out</p>
      </div>

      <div className="cart-layout">
        {/* Cart Items List */}
        <div className="cart-items-column">
          <div className="cart-header-actions">
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'} in your basket
            </span>
            <button type="button" className="btn-clear-cart" onClick={clearCart}>
              <FaTrash /> Clear Cart
            </button>
          </div>

          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}

          <div style={{ marginTop: '1rem' }}>
            <Link to="/restaurants" className="btn btn-outline" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <FaArrowLeft /> Add More Items
            </Link>
          </div>
        </div>

        {/* Order Bill Summary */}
        <div className="order-summary-card">
          <h3 className="summary-title">Order Bill Summary</h3>

          <div className="cart-delivery-badge">
            <FaCheckCircle />
            <span>Fast contactless delivery enabled</span>
          </div>

          <div className="summary-row">
            <span>Item Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>₹{deliveryCharge.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Platform & Tech Fee</span>
            <span>₹{platformFee.toFixed(2)}</span>
          </div>

          <div className="summary-row total-row">
            <span>Total to Pay</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="summary-actions" style={{ marginTop: '1.5rem' }}>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
