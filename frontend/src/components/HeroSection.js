import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar';
import './HeroSection.css';

const HeroSection = () => {
  const navigate = useNavigate();

  const quickCategories = [
    { label: '🍕 Pizza', category: 'Pizza' },
    { label: '🍔 Burgers', category: 'Burger' },
    { label: '🍛 Biryani', category: 'Biryani' },
    { label: '🍜 Chinese', category: 'Chinese' },
    { label: '🥗 Healthy', category: 'Salad' },
    { label: '🍰 Desserts', category: 'Dessert' },
  ];

  const handleCategoryClick = (category) => {
    navigate(`/restaurants?cuisine=${encodeURIComponent(category)}`);
  };

  return (
    <section className="hero-section">
      <span className="floating-emoji emoji-1">🍕</span>
      <span className="floating-emoji emoji-2">🍔</span>
      <span className="floating-emoji emoji-3">🍜</span>
      <span className="floating-emoji emoji-4">🧁</span>

      <div className="hero-container">
        <div className="hero-badge">
          <span>⚡ Lightning Fast Food Delivery</span>
        </div>

        <h1 className="hero-title">
          Delicious Food, <span className="hero-title-highlight">Delivered Fast 🚀</span>
        </h1>

        <p className="hero-subtitle">
          Order from your favorite restaurants and enjoy freshly prepared meals delivered straight to your doorstep in minutes.
        </p>

        <div className="hero-search-wrapper">
          <SearchBar placeholder="Search restaurants or cuisines..." />
        </div>

        <div className="hero-quick-filters">
          {quickCategories.map((item, index) => (
            <button
              key={index}
              className="quick-filter-btn"
              onClick={() => handleCategoryClick(item.category)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
