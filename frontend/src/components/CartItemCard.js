import React from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import './CartItemCard.css';

const CartItemCard = ({ item, onUpdateQuantity, onRemove }) => {
  if (!item) return null;

  const food = item.foodItem || item;
  const itemId = item.id;
  const foodName = food.name || item.foodName || 'Food Item';
  const price = food.price !== undefined ? food.price : item.price || 0;
  const quantity = item.quantity || 1;
  const itemTotal = item.subtotal || item.totalPrice || price * quantity;
  const imageUrl = food.imageUrl || item.imageUrl;

  return (
    <div className="cart-item-card">
      <div className="cart-item-left">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={foodName}
            className="cart-item-thumbnail"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="cart-item-thumbnail">🍲</div>';
            }}
          />
        ) : (
          <div className="cart-item-thumbnail">🍲</div>
        )}

        <div className="cart-item-info">
          <h4 className="cart-item-name">{foodName}</h4>
          <span className="cart-item-unit-price">₹{Number(price).toFixed(2)} each</span>
        </div>
      </div>

      <div className="cart-item-actions">
        <div className="cart-qty-control">
          <button
            type="button"
            className="qty-btn"
            onClick={() => onUpdateQuantity(itemId, quantity - 1)}
            aria-label="Decrease quantity"
          >
            <FaMinus />
          </button>
          <span className="qty-count">{quantity}</span>
          <button
            type="button"
            className="qty-btn"
            onClick={() => onUpdateQuantity(itemId, quantity + 1)}
            aria-label="Increase quantity"
          >
            <FaPlus />
          </button>
        </div>

        <div className="cart-item-total">₹{Number(itemTotal).toFixed(2)}</div>

        <button
          type="button"
          className="cart-item-remove-btn"
          onClick={() => onRemove(itemId)}
          aria-label={`Remove ${foodName} from cart`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
