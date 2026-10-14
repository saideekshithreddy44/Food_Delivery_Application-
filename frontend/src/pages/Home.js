import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaUtensils, FaTruck, FaSmile } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import RestaurantCard from '../components/RestaurantCard';
import LoadingSpinner from '../components/LoadingSpinner';
import restaurantService from '../services/restaurantService';
import './Home.css';

const DEFAULT_RESTAURANTS = [
  {
    id: 1,
    name: 'Spice Symphony',
    cuisineType: 'North Indian, Biryani',
    rating: 4.6,
    address: 'Indiranagar, Bangalore',
    deliveryTime: '25-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
  {
    id: 2,
    name: 'Pizzeria Bella',
    cuisineType: 'Italian, Pizza, Pasta',
    rating: 4.8,
    address: 'Koramangala, Bangalore',
    deliveryTime: '30-40 min',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
  {
    id: 3,
    name: 'Dragon Wok Express',
    cuisineType: 'Chinese, Asian',
    rating: 4.4,
    address: 'HSR Layout, Bangalore',
    deliveryTime: '20-25 min',
    imageUrl: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
  {
    id: 4,
    name: 'Burger & Co.',
    cuisineType: 'Burgers, American, Fast Food',
    rating: 4.5,
    address: 'MG Road, Bangalore',
    deliveryTime: '15-25 min',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
];

const CATEGORIES = [
  { name: 'Biryani', icon: '🍛' },
  { name: 'Pizza', icon: '🍕' },
  { name: 'Burger', icon: '🍔' },
  { name: 'Chinese', icon: '🍜' },
  { name: 'Rolls', icon: '🌯' },
  { name: 'Desserts', icon: '🍰' },
  { name: 'Healthy', icon: '🥗' },
  { name: 'Beverages', icon: '🥤' },
];

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const data = await restaurantService.getAllRestaurants();
        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        } else {
          setRestaurants(DEFAULT_RESTAURANTS);
        }
      } catch (err) {
        console.warn('Could not load live restaurants, using fallback:', err);
        setRestaurants(DEFAULT_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="home-page">
      {/* 1. Hero Banner */}
      <HeroSection />

      {/* 2. Food Categories */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Inspiration for Your Order</h2>
            <p className="section-subtitle">Explore delicious choices across popular categories</p>
          </div>
        </div>

        <div className="categories-grid">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={index}
              to={`/restaurants?cuisine=${encodeURIComponent(cat.name)}`}
              className="category-card"
            >
              <span className="category-icon">{cat.icon}</span>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Popular Restaurants */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Restaurants</h2>
            <p className="section-subtitle">Top-rated dining spots delivered straight to your door</p>
          </div>
          <Link to="/restaurants" className="view-all-link">
            See All Restaurants <FaArrowRight />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner text="Finding the best restaurants near you..." />
        ) : (
          <div className="restaurants-grid">
            {restaurants.slice(0, 8).map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </section>

      {/* 4. How It Works Section */}
      <section className="how-it-works-section">
        <div className="section-container">
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 className="section-title">How FoodExpress Works</h2>
            <p className="section-subtitle">Order your favorite meals in 3 simple steps</p>
          </div>

          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <div className="step-icon">
                <FaUtensils style={{ color: '#FF6B35' }} />
              </div>
              <h3 className="step-title">Choose Your Food</h3>
              <p className="step-desc">
                Browse through curated menus from our top restaurants and pick your cravings.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">2</span>
              <div className="step-icon">
                <FaTruck style={{ color: '#004E89' }} />
              </div>
              <h3 className="step-title">Fast Delivery</h3>
              <p className="step-desc">
                Our speedy delivery partners pick up fresh food and dash right to your doorstep.
              </p>
            </div>

            <div className="step-card">
              <span className="step-number">3</span>
              <div className="step-icon">
                <FaSmile style={{ color: '#F7C948' }} />
              </div>
              <h3 className="step-title">Enjoy Your Meal</h3>
              <p className="step-desc">
                Unbox hot, delicious food with friends and family. Bon appétit!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Promotional Call-To-Action */}
      <section className="section-container">
        <div className="promo-banner">
          <div className="promo-content">
            <h3>Are You a Restaurant Owner?</h3>
            <p>
              Partner with FoodExpress to reach thousands of hungry customers, grow your orders, and boost your business today.
            </p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Register Your Restaurant
            </Link>
          </div>
          <div className="promo-icon">👨‍🍳</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
