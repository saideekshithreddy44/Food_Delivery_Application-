import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './RestaurantCard.css';

const RestaurantCard = ({ restaurant }) => {
  if (!restaurant) return null;

  const {
    id,
    name = 'Unnamed Restaurant',
    cuisineType,
    cuisine,
    rating = 4.2,
    address = 'City Center',
    imageUrl,
    isOpen = true,
    deliveryTime = '25-35 min',
  } = restaurant;

  const displayCuisine = cuisineType || cuisine || 'Multi-Cuisine';

  return (
    <Link to={`/restaurants/${id}`} className="restaurant-card">
      <div className="restaurant-card-img-wrapper">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="restaurant-card-img"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<div class="restaurant-img-placeholder">🍽️</div>';
            }}
          />
        ) : (
          <div className="restaurant-img-placeholder">🍽️</div>
        )}

        <div className="restaurant-rating-badge">
          <FaStar style={{ color: '#F7C948' }} />
          <span>{Number(rating).toFixed(1)}</span>
        </div>
      </div>

      <div className="restaurant-card-body">
        <h3 className="restaurant-name">{name}</h3>
        <span className="restaurant-cuisine">{displayCuisine}</span>
        <div className="restaurant-address">
          <FaMapMarkerAlt style={{ color: '#FF6B35', flexShrink: 0 }} />
          <span>{address}</span>
        </div>

        <div className="restaurant-card-footer">
          <div className="restaurant-delivery-time">
            <FaClock />
            <span>{deliveryTime}</span>
          </div>

          <span className={`restaurant-status-badge ${isOpen ? 'status-open' : 'status-closed'}`}>
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
