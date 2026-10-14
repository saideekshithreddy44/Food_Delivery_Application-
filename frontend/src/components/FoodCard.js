import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './FoodCard.css';

const FoodCard = ({ foodItem }) => {
  const { cart, addToCart, updateQuantity, removeItem } = useCart();

  if (!foodItem) return null;

  const {
    id,
    name = 'Tasty Food',
    description = '',
    price = 0,
    imageUrl,
    category,
    isVegetarian = true,
    vegetarian,
    isAvailable = true,
    available = true,
  } = foodItem;

  const isVeg = isVegetarian !== undefined ? isVegetarian : vegetarian;
  const inStock = isAvailable !== undefined ? isAvailable : (available !== undefined ? available : true);

  // Check if item is currently in cart
  const cartItems = cart?.items || cart?.cartItems || [];
  const existingCartItem = cartItems.find((item) => {
    const itemFoodId = item.foodItem?.id || item.foodItemId || item.foodId;
    return itemFoodId === id;
  });

  const cartQuantity = existingCartItem ? existingCartItem.quantity : 0;

  const handleAdd = () => {
    addToCart(id, 1);
  };

  const handleIncrement = () => {
    if (existingCartItem) {
      updateQuantity(existingCartItem.id, existingCartItem.quantity + 1);
    } else {
      addToCart(id, 1);
    }
  };

  const handleDecrement = () => {
    if (existingCartItem) {
      if (existingCartItem.quantity > 1) {
        updateQuantity(existingCartItem.id, existingCartItem.quantity - 1);
      } else {
        removeItem(existingCartItem.id);
      }
    }
  };

  const getFallbackEmoji = (cat) => {
    const lower = (cat || '').toLowerCase();
    if (lower.includes('pizza')) return '🍕';
    if (lower.includes('burger')) return '🍔';
    if (lower.includes('biryani') || lower.includes('rice')) return '🍛';
    if (lower.includes('noodle') || lower.includes('pasta')) return '🍜';
    if (lower.includes('dessert') || lower.includes('sweet') || lower.includes('cake')) return '🍰';
    if (lower.includes('beverage') || lower.includes('drink') || lower.includes('shake')) return '🥤';
    if (lower.includes('salad')) return '🥗';
    return '🍲';
  };

  return (
    <div className={`food-card ${!inStock ? 'unavailable' : ''}`}>
      <div className="food-card-img-container">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="food-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = `<div class="food-img-placeholder">${getFallbackEmoji(category)}</div>`;
            }}
          />
        ) : (
          <div className="food-img-placeholder">{getFallbackEmoji(category)}</div>
        )}

        <div className={`food-veg-badge ${isVeg ? 'veg-border' : 'non-veg-border'}`}>
          <div className={isVeg ? 'veg-dot' : 'non-veg-dot'}></div>
        </div>
      </div>

      <div className="food-card-content">
        {category && <span className="food-category-pill">{category}</span>}
        <h4 className="food-card-title">{name}</h4>
        <p className="food-card-desc">{description || 'Made fresh to order with premium quality ingredients.'}</p>

        <div className="food-card-footer">
          <span className="food-card-price">₹{Number(price).toFixed(2)}</span>

          {!inStock ? (
            <span className="unavailable-badge">Sold Out</span>
          ) : cartQuantity > 0 ? (
            <div className="cart-qty-control">
              <button
                type="button"
                className="qty-btn"
                onClick={handleDecrement}
                aria-label="Decrease quantity"
              >
                <FaMinus />
              </button>
              <span className="qty-count">{cartQuantity}</span>
              <button
                type="button"
                className="qty-btn"
                onClick={handleIncrement}
                aria-label="Increase quantity"
              >
                <FaPlus />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-add-food"
              onClick={handleAdd}
              aria-label={`Add ${name} to cart`}
            >
              <FaPlus /> Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
