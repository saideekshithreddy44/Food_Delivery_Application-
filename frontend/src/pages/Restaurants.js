import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RestaurantCard from '../components/RestaurantCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import restaurantService from '../services/restaurantService';
import './Restaurants.css';

const CUISINES = ['All', 'North Indian', 'Biryani', 'Pizza', 'Burger', 'Chinese', 'Italian', 'Healthy', 'Dessert'];

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
  {
    id: 5,
    name: 'Green Bowl Delights',
    cuisineType: 'Healthy, Salad, Vegan',
    rating: 4.7,
    address: 'Whitefield, Bangalore',
    deliveryTime: '25-35 min',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
  {
    id: 6,
    name: 'Sweet Tooth Confectionery',
    cuisineType: 'Dessert, Bakery, Ice Cream',
    rating: 4.9,
    address: 'Jayanagar, Bangalore',
    deliveryTime: '20-30 min',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
    isOpen: true,
  },
];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const urlCuisine = searchParams.get('cuisine') || 'All';

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState(urlCuisine);

  useEffect(() => {
    setSelectedCuisine(urlCuisine || 'All');
  }, [urlCuisine]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        let data;
        if (urlSearch.trim()) {
          data = await restaurantService.searchRestaurants(urlSearch.trim());
        } else {
          data = await restaurantService.getAllRestaurants();
        }

        if (Array.isArray(data) && data.length > 0) {
          setRestaurants(data);
        } else {
          setRestaurants(DEFAULT_RESTAURANTS);
        }
      } catch (err) {
        console.warn('Could not fetch restaurants from server, using fallback:', err);
        setRestaurants(DEFAULT_RESTAURANTS);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [urlSearch]);

  const handleCuisineSelect = (cuisine) => {
    setSelectedCuisine(cuisine);
    if (cuisine === 'All') {
      searchParams.delete('cuisine');
    } else {
      searchParams.set('cuisine', cuisine);
    }
    setSearchParams(searchParams);
  };

  const handleSearchSubmit = (searchTerm) => {
    if (searchTerm) {
      searchParams.set('search', searchTerm);
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  // Filter restaurants by selected cuisine
  const filteredRestaurants = restaurants.filter((restaurant) => {
    if (selectedCuisine === 'All') return true;
    const cuisine = (restaurant.cuisineType || restaurant.cuisine || '').toLowerCase();
    return cuisine.includes(selectedCuisine.toLowerCase());
  });

  return (
    <div className="restaurants-page">
      <div className="page-header">
        <h1 className="page-title">Explore Restaurants 🍽️</h1>
        <p className="page-subtitle">
          Find your favorite cuisines, local gems, and best rated delivery spots
        </p>
      </div>

      <div className="restaurants-filter-bar">
        <SearchBar
          placeholder="Search restaurants by name, dish, or location..."
          onSearch={handleSearchSubmit}
          autoNavigate={false}
        />

        <div className="cuisine-filter-chips">
          {CUISINES.map((cuisine) => (
            <button
              key={cuisine}
              className={`cuisine-chip ${selectedCuisine.toLowerCase() === cuisine.toLowerCase() ? 'active' : ''}`}
              onClick={() => handleCuisineSelect(cuisine)}
            >
              {cuisine}
            </button>
          ))}
        </div>
      </div>

      <div className="restaurants-result-stats">
        {loading ? (
          'Searching delicious spots...'
        ) : (
          `Showing ${filteredRestaurants.length} restaurants ${
            selectedCuisine !== 'All' ? `serving ${selectedCuisine}` : ''
          } ${urlSearch ? `matching "${urlSearch}"` : ''}`
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading restaurants..." />
      ) : filteredRestaurants.length > 0 ? (
        <div className="restaurants-grid">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3 className="empty-state-title">No restaurants found</h3>
          <p className="empty-state-text">
            We couldn't find any restaurants matching your current search or filter. Try selecting "All" or a different query.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSearchParams({});
              setSelectedCuisine('All');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Restaurants;
