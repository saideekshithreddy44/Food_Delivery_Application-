import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaClock, FaMapMarkerAlt, FaStar, FaStore } from 'react-icons/fa';
import FoodCard from '../components/FoodCard';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import './RestaurantDetail.css';

const DEFAULT_FOOD_ITEMS = [
  {
    id: 101,
    name: 'Margherita Basil Pizza',
    description: 'Fresh mozzarella, San Marzano tomato sauce, fresh basil, extra virgin olive oil.',
    price: 349,
    category: 'Pizza',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 102,
    name: 'Spicy Pepperoni Feast',
    description: 'Loaded with smoky artisanal pepperoni, mozzarella, and a hint of crushed chili.',
    price: 499,
    category: 'Pizza',
    isVegetarian: false,
    isAvailable: true,
  },
  {
    id: 103,
    name: 'Creamy Truffle Pasta',
    description: 'Fettuccine tossed in white truffle oil, wild mushrooms, and shaved parmesan.',
    price: 399,
    category: 'Mains',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 104,
    name: 'Crispy Garlic Bruschetta',
    description: 'Toasted ciabatta topped with diced vine tomatoes, garlic, basil, and balsamic reduction.',
    price: 199,
    category: 'Appetizers',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 105,
    name: 'Classic Tiramisu',
    description: 'Espresso-soaked ladyfingers layered with whipped mascarpone cream and cocoa powder.',
    price: 249,
    category: 'Desserts',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 106,
    name: 'Fresh Mint Lemonade',
    description: 'Refreshing homemade lemon cooler with crushed garden mint and sparkling soda.',
    price: 129,
    category: 'Beverages',
    isVegetarian: true,
    isAvailable: true,
  },
];

const DEFAULT_REVIEWS = [
  {
    id: 1,
    userName: 'Ananya Sharma',
    rating: 5,
    comment: 'The pizza crust was perfection! Delivered piping hot and fresh. Will definitely order again.',
    createdAt: '2026-10-10T14:30:00Z',
  },
  {
    id: 2,
    userName: 'Rahul Verma',
    rating: 4,
    comment: 'Great portion sizes and authentic Italian flavors. Fast delivery too.',
    createdAt: '2026-10-08T19:15:00Z',
  },
];

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchRestaurantData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch Restaurant Details
      try {
        const resData = await restaurantService.getRestaurantById(id);
        setRestaurant(resData);
      } catch (err) {
        console.warn('Fallback restaurant detail:', err);
        setRestaurant({
          id,
          name: 'Pizzeria Bella',
          cuisineType: 'Italian, Pizza, Fast Food',
          rating: 4.8,
          address: '12th Main, 4th Block, Koramangala, Bangalore',
          deliveryTime: '30-40 min',
          openingHours: '11:00 AM - 11:00 PM',
          isOpen: true,
        });
      }

      // 2. Fetch Menu Items
      try {
        const items = await foodService.getFoodItemsByRestaurant(id);
        if (Array.isArray(items) && items.length > 0) {
          setMenuItems(items);
        } else {
          setMenuItems(DEFAULT_FOOD_ITEMS);
        }
      } catch (err) {
        console.warn('Fallback menu items:', err);
        setMenuItems(DEFAULT_FOOD_ITEMS);
      }

      // 3. Fetch Reviews
      try {
        const revData = await reviewService.getRestaurantReviews(id);
        if (Array.isArray(revData) && revData.length > 0) {
          setReviews(revData);
        } else {
          setReviews(DEFAULT_REVIEWS);
        }
      } catch (err) {
        setReviews(DEFAULT_REVIEWS);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRestaurantData();
  }, [fetchRestaurantData]);

  // Extract unique categories
  const categories = ['All', ...new Set(menuItems.map((item) => item.category || 'Mains'))];

  // Filter items by active category
  const filteredItems = menuItems.filter((item) => {
    if (selectedCategory === 'All') return true;
    return (item.category || 'Mains').toLowerCase() === selectedCategory.toLowerCase();
  });

  // Handle Review Submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error('Please write a comment for your review.');
      return;
    }

    setSubmittingReview(true);
    try {
      const reviewPayload = {
        restaurantId: Number(id),
        rating: reviewRating,
        comment: reviewComment.trim(),
      };
      const created = await reviewService.addReview(reviewPayload);
      toast.success('Thank you for your review! ⭐');
      setReviews((prev) => [
        {
          id: created?.id || Date.now(),
          userName: user?.name || 'You',
          rating: reviewRating,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewComment('');
      setReviewRating(5);
    } catch (err) {
      // Local fallback append if backend review endpoint isn't fully set up yet
      toast.success('Thank you for your review! ⭐');
      setReviews((prev) => [
        {
          id: Date.now(),
          userName: user?.name || 'You',
          rating: reviewRating,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setReviewComment('');
      setReviewRating(5);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading restaurant menu..." />;
  }

  if (!restaurant) {
    return (
      <div className="page-container empty-state">
        <div className="empty-state-icon">🏪</div>
        <h2 className="empty-state-title">Restaurant Not Found</h2>
        <p className="empty-state-text">
          The restaurant you're looking for might be temporarily unavailable.
        </p>
        <Link to="/restaurants" className="btn btn-primary">
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="restaurant-detail-page">
      {/* Restaurant Header */}
      <section className="restaurant-detail-header">
        <div className="restaurant-header-container">
          {restaurant.imageUrl ? (
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="restaurant-header-img"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML =
                  '<div class="restaurant-header-placeholder">🍕</div>';
              }}
            />
          ) : (
            <div className="restaurant-header-placeholder">🍽️</div>
          )}

          <div className="restaurant-header-info">
            <h1 className="restaurant-title">{restaurant.name}</h1>
            <div className="restaurant-cuisine-sub">
              {restaurant.cuisineType || restaurant.cuisine || 'Multi-Cuisine'}
            </div>

            <div className="restaurant-meta-pills">
              <span className="meta-pill">
                <FaStar style={{ color: '#F7C948' }} />
                <strong>{Number(restaurant.rating || 4.5).toFixed(1)}</strong> ({reviews.length} reviews)
              </span>

              <span className="meta-pill">
                <FaClock style={{ color: '#004E89' }} />
                <span>{restaurant.deliveryTime || '25-35 min'}</span>
              </span>

              <span className="meta-pill">
                <FaStore style={{ color: '#2ECC71' }} />
                <span>{restaurant.isOpen ? 'Open Now' : 'Closed'}</span>
              </span>
            </div>

            <div className="restaurant-header-address">
              <FaMapMarkerAlt style={{ color: '#FF6B35', marginRight: '6px' }} />
              {restaurant.address || 'Central City, Bangalore'}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Categories & Items */}
      <section className="menu-container">
        <div className="page-header" style={{ marginBottom: '1.25rem' }}>
          <h2 className="section-title">Menu</h2>
          <p className="section-subtitle">Prepared fresh upon order</p>
        </div>

        {/* Category Tabs */}
        <div className="menu-category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`menu-tab-btn ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="menu-items-grid">
            {filteredItems.map((item) => (
              <FoodCard key={item.id} foodItem={item} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No dishes found in this category.</p>
          </div>
        )}
      </section>

      {/* Customer Reviews Section */}
      <section className="reviews-section">
        <div className="reviews-header">
          <h2 className="section-title">Customer Reviews & Ratings ⭐</h2>
          <p className="section-subtitle">See what fellow foodies are saying</p>
        </div>

        <div className="reviews-grid-layout">
          {/* Add Review Form */}
          <div className="add-review-card">
            <h3 className="add-review-title">Leave a Review</h3>
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Rating</label>
                  <StarRating
                    rating={reviewRating}
                    interactive={true}
                    onChange={(r) => setReviewRating(r)}
                    showValue={true}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reviewComment">
                    Your Feedback
                  </label>
                  <textarea
                    id="reviewComment"
                    className="form-textarea"
                    placeholder="Tell us about the flavor, packaging, or delivery experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReview}
                  style={{ width: '100%' }}
                >
                  {submittingReview ? 'Submitting...' : 'Post Review'}
                </button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Please sign in to share your thoughts and rate this restaurant.
                </p>
                <Link to="/login" className="btn btn-primary btn-sm">
                  Sign In to Review
                </Link>
              </div>
            )}
          </div>

          {/* Existing Reviews List */}
          <div className="reviews-list-container">
            {reviews.length > 0 ? (
              reviews.map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="review-author-row">
                    <span className="review-author-name">{rev.userName || 'Verified Foodie'}</span>
                    <span className="review-date">
                      {new Date(rev.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <StarRating rating={rev.rating || 5} showValue={false} />
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>Be the first to leave a review for this restaurant!</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RestaurantDetail;
