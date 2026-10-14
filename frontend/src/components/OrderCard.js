import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronUp, FaReceipt, FaArrowRight } from 'react-icons/fa';
import './OrderCard.css';

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);

  if (!order) return null;

  const {
    id,
    orderNumber = `ORD-${id}`,
    createdAt,
    orderDate,
    status = 'PENDING',
    restaurant,
    restaurantName,
    items = [],
    orderItems = [],
    totalAmount = 0,
    total = 0,
  } = order;

  const displayItems = items.length > 0 ? items : orderItems;
  const displayRestaurantName = restaurant?.name || restaurantName || 'FoodExpress Partner';
  const displayTotal = totalAmount || total || 0;

  // Format date
  const rawDate = createdAt || orderDate || new Date();
  const formattedDate = new Date(rawDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Status badge class
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '_');
  const statusClass = `status-${normalizedStatus}`;

  const itemCount = displayItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <div className="order-card">
      <div className="order-card-header">
        <div className="order-id-group">
          <FaReceipt style={{ color: '#FF6B35' }} />
          <div>
            <span className="order-number">#{orderNumber}</span>
            <div className="order-date">{formattedDate}</div>
          </div>
        </div>

        <span className={`status-badge ${statusClass}`}>
          {status.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="order-card-body">
        <div className="order-restaurant-info">
          <span className="order-restaurant-icon">🏪</span>
          <div>
            <h4 className="order-restaurant-name">{displayRestaurantName}</h4>
            <span className="order-items-summary">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        <div className="order-price-group">
          <span className="order-total-label">Total Amount</span>
          <span className="order-total-amount">₹{Number(displayTotal).toFixed(2)}</span>
        </div>
      </div>

      {expanded && (
        <div className="order-expanded-items">
          {displayItems.map((item, index) => {
            const foodName = item.foodItem?.name || item.foodName || item.name || 'Food Item';
            const price = item.price || item.foodItem?.price || 0;
            const qty = item.quantity || 1;
            return (
              <div key={index} className="expanded-item-row">
                <span className="expanded-item-name">
                  {foodName} <span className="expanded-item-qty">x {qty}</span>
                </span>
                <span className="expanded-item-price">₹{Number(price * qty).toFixed(2)}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="order-card-footer">
        {displayItems.length > 0 ? (
          <button
            type="button"
            className="btn-toggle-items"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <>Hide Items <FaChevronUp /></>
            ) : (
              <>View Items ({displayItems.length}) <FaChevronDown /></>
            )}
          </button>
        ) : <div />}

        <Link to={`/orders/${id}`} className="btn btn-outline btn-sm">
          Track Order <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default OrderCard;
