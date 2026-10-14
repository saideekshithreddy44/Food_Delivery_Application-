import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import restaurantService from '../services/restaurantService';
import './SearchBar.css';

const SearchBar = ({ placeholder = 'Search for food or restaurants...', onSearch, autoNavigate = true }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounce search
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await restaurantService.searchRestaurants(searchTerm.trim());
        setResults(Array.isArray(data) ? data : []);
        setIsOpen(true);
      } catch (err) {
        console.warn('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsOpen(false);
      if (onSearch) {
        onSearch(searchTerm.trim());
      } else if (autoNavigate) {
        navigate(`/restaurants?search=${encodeURIComponent(searchTerm.trim())}`);
      }
    }
  };

  const handleSelectRestaurant = (id) => {
    setIsOpen(false);
    navigate(`/restaurants/${id}`);
  };

  const handleClear = () => {
    setSearchTerm('');
    setResults([]);
    setIsOpen(false);
    if (onSearch) onSearch('');
  };

  return (
    <div className="search-bar-wrapper" ref={dropdownRef}>
      <form onSubmit={handleSubmit} className="search-input-container">
        <span className="search-icon">
          <FaSearch />
        </span>
        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.trim().length > 0 && setIsOpen(true)}
        />
        {searchTerm && (
          <button type="button" className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
            <FaTimes />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="search-dropdown">
          {loading ? (
            <div className="search-dropdown-loading">Searching delicious options...</div>
          ) : results.length > 0 ? (
            results.slice(0, 6).map((restaurant) => (
              <div
                key={restaurant.id}
                className="search-dropdown-item"
                onClick={() => handleSelectRestaurant(restaurant.id)}
              >
                <span className="dropdown-item-icon">🍽️</span>
                <div className="dropdown-item-info">
                  <div className="dropdown-item-title">{restaurant.name}</div>
                  <div className="dropdown-item-subtitle">
                    {restaurant.cuisineType || restaurant.cuisine || 'Multi-Cuisine'} • {restaurant.address || 'Local'}
                  </div>
                </div>
                <span className="dropdown-item-badge">Restaurant</span>
              </div>
            ))
          ) : (
            <div className="search-dropdown-empty">
              No restaurants found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
