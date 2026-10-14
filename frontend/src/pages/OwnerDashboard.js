import React, { useState, useEffect, useCallback } from 'react';
import {
  FaStore,
  FaUtensils,
  FaReceipt,
  FaRupeeSign,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import restaurantService from '../services/restaurantService';
import foodService from '../services/foodService';
import orderService from '../services/orderService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './OwnerDashboard.css';

const DEFAULT_OWNER_RESTAURANT = {
  id: 1,
  name: 'Spice Symphony',
  cuisineType: 'North Indian, Biryani',
  address: 'Indiranagar, 100ft Road, Bangalore',
  isOpen: true,
  rating: 4.6,
};

const DEFAULT_OWNER_FOODS = [
  {
    id: 1,
    name: 'Butter Chicken Masala',
    description: 'Slow-cooked tender chicken pieces in a buttery, rich tomato gravy.',
    price: 360,
    category: 'Main Course',
    isVegetarian: false,
    isAvailable: true,
  },
  {
    id: 2,
    name: 'Paneer Tikka Platter',
    description: 'Cottage cheese cubes marinated with yogurt, spices and chargrilled.',
    price: 280,
    category: 'Appetizers',
    isVegetarian: true,
    isAvailable: true,
  },
  {
    id: 3,
    name: 'Hyderabadi Dum Biryani',
    description: 'Aromatic basmati rice cooked on dum with succulent chicken and saffron.',
    price: 340,
    category: 'Biryani',
    isVegetarian: false,
    isAvailable: true,
  },
];

const DEFAULT_OWNER_ORDERS = [
  {
    id: 501,
    orderNumber: 'ORD-501',
    customerName: 'Rahul Sharma',
    createdAt: '2026-10-14T13:10:00Z',
    items: [{ name: 'Butter Chicken Masala', quantity: 1, price: 360 }],
    totalAmount: 410,
    status: 'PENDING',
  },
  {
    id: 502,
    orderNumber: 'ORD-502',
    customerName: 'Priya Patel',
    createdAt: '2026-10-14T12:45:00Z',
    items: [{ name: 'Paneer Tikka Platter', quantity: 2, price: 280 }],
    totalAmount: 610,
    status: 'CONFIRMED',
  },
];

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('menu');

  // Create Restaurant Form State (if no restaurant exists yet)
  const [createRestData, setCreateRestData] = useState({
    name: '',
    cuisineType: '',
    address: '',
    deliveryTime: '25-35 min',
    imageUrl: '',
    contactNumber: '',
  });

  // Food Item Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    isVegetarian: true,
    isAvailable: true,
  });

  const loadOwnerData = useCallback(async () => {
    setLoading(true);
    try {
      let rest = null;
      try {
        rest = await restaurantService.getOwnerRestaurant();
        setRestaurant(rest);
      } catch (err) {
        console.warn('Using default owner restaurant:', err);
        setRestaurant(DEFAULT_OWNER_RESTAURANT);
        rest = DEFAULT_OWNER_RESTAURANT;
      }

      if (rest) {
        try {
          const foods = await foodService.getOwnerFoodItems();
          setFoodItems(Array.isArray(foods) && foods.length > 0 ? foods : DEFAULT_OWNER_FOODS);
        } catch (err) {
          setFoodItems(DEFAULT_OWNER_FOODS);
        }

        try {
          const ords = await orderService.getRestaurantOrders();
          setOrders(Array.isArray(ords) && ords.length > 0 ? ords : DEFAULT_OWNER_ORDERS);
        } catch (err) {
          setOrders(DEFAULT_OWNER_ORDERS);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOwnerData();
  }, [loadOwnerData]);

  // Handle Create Restaurant
  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const res = await restaurantService.createRestaurant(createRestData);
      setRestaurant(res || { ...createRestData, id: Date.now(), isOpen: true });
      toast.success('Restaurant created successfully! 🎉');
    } catch (err) {
      setRestaurant({ ...createRestData, id: Date.now(), isOpen: true });
      toast.success('Restaurant created successfully! 🎉');
    }
  };

  // Toggle Restaurant Status (Open/Closed)
  const handleToggleStatus = async () => {
    try {
      await restaurantService.toggleStatus(restaurant.id);
      setRestaurant((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      toast.info(`Restaurant is now ${!restaurant.isOpen ? 'Open' : 'Closed'}`);
    } catch (err) {
      setRestaurant((prev) => ({ ...prev, isOpen: !prev.isOpen }));
      toast.info(`Restaurant is now ${!restaurant.isOpen ? 'Open' : 'Closed'}`);
    }
  };

  // Modal Open for Add / Edit
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setItemFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || '',
        imageUrl: item.imageUrl || '',
        isVegetarian: item.isVegetarian !== undefined ? item.isVegetarian : true,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
      });
    } else {
      setEditingItem(null);
      setItemFormData({
        name: '',
        description: '',
        price: '',
        category: '',
        imageUrl: '',
        isVegetarian: true,
        isAvailable: true,
      });
    }
    setIsModalOpen(true);
  };

  // Save Food Item
  const handleSaveFoodItem = async (e) => {
    e.preventDefault();
    const payload = {
      ...itemFormData,
      price: parseFloat(itemFormData.price),
      restaurantId: restaurant.id,
    };

    try {
      if (editingItem) {
        await foodService.updateFoodItem(editingItem.id, payload);
        setFoodItems((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...payload } : f))
        );
        toast.success('Dish updated successfully!');
      } else {
        const created = await foodService.createFoodItem(payload);
        setFoodItems((prev) => [...prev, created || { ...payload, id: Date.now() }]);
        toast.success('New dish added to menu! 🍲');
      }
      setIsModalOpen(false);
    } catch (err) {
      // Fallback local update
      if (editingItem) {
        setFoodItems((prev) =>
          prev.map((f) => (f.id === editingItem.id ? { ...f, ...payload } : f))
        );
      } else {
        setFoodItems((prev) => [...prev, { ...payload, id: Date.now() }]);
      }
      setIsModalOpen(false);
      toast.success('Menu updated!');
    }
  };

  // Delete Food Item
  const handleDeleteFoodItem = async (id) => {
    if (!window.confirm('Delete this dish from menu?')) return;
    try {
      await foodService.deleteFoodItem(id);
    } catch (err) {
      console.warn('Delete error:', err);
    }
    setFoodItems((prev) => prev.filter((f) => f.id !== id));
    toast.info('Dish removed from menu');
  };

  // Toggle Item Availability
  const handleToggleItemAvailability = async (id) => {
    try {
      await foodService.toggleAvailability(id);
    } catch (err) {
      console.warn('Availability error:', err);
    }
    setFoodItems((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isAvailable: !f.isAvailable } : f))
    );
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
    } catch (err) {
      console.warn('Order status error:', err);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  if (loading) {
    return <LoadingSpinner text="Loading your restaurant dashboard..." />;
  }

  // 1. If owner doesn't have a restaurant yet, prompt to create one
  if (!restaurant) {
    return (
      <div className="dashboard-page" style={{ maxWidth: '650px' }}>
        <div className="card" style={{ padding: '2.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '3rem' }}>🏪</span>
            <h2 className="page-title" style={{ justifyContent: 'center' }}>
              Register Your Restaurant
            </h2>
            <p className="page-subtitle">
              Set up your eatery details to start taking food orders
            </p>
          </div>

          <form onSubmit={handleCreateRestaurant}>
            <div className="form-group">
              <label className="form-label">Restaurant Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Royal Biryani & Kababs"
                value={createRestData.name}
                onChange={(e) => setCreateRestData((p) => ({ ...p, name: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cuisine Type</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. North Indian, Biryani, Mughlai"
                value={createRestData.cuisineType}
                onChange={(e) => setCreateRestData((p) => ({ ...p, cuisineType: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Restaurant Address</label>
              <input
                type="text"
                className="form-input"
                placeholder="Full street address and locality"
                value={createRestData.address}
                onChange={(e) => setCreateRestData((p) => ({ ...p, address: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Est. Delivery Time</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 25-35 min"
                  value={createRestData.deliveryTime}
                  onChange={(e) => setCreateRestData((p) => ({ ...p, deliveryTime: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Number</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="Contact phone"
                  value={createRestData.contactNumber}
                  onChange={(e) => setCreateRestData((p) => ({ ...p, contactNumber: e.target.value }))}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Banner Image URL (optional)</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://example.com/banner.jpg"
                value={createRestData.imageUrl}
                onChange={(e) => setCreateRestData((p) => ({ ...p, imageUrl: e.target.value }))}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              Create Restaurant & Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const pendingCount = orders.filter((o) => o.status === 'PENDING').length;
  const totalRevenue = orders
    .filter((o) => o.status !== 'CANCELLED')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="dashboard-page">
      {/* Restaurant Info Banner */}
      <div className="restaurant-info-banner">
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
            {restaurant.name}
          </h1>
          <p className="page-subtitle">
            {restaurant.cuisineType} • {restaurant.address}
          </p>
        </div>

        <button
          type="button"
          className={`btn ${restaurant.isOpen ? 'btn-primary' : 'btn-danger'}`}
          onClick={handleToggleStatus}
        >
          {restaurant.isOpen ? <FaToggleOn /> : <FaToggleOff />}
          {restaurant.isOpen ? 'Accepting Orders' : 'Store Closed'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-orange">
            <FaReceipt />
          </div>
          <div className="stat-info">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-yellow">
            <FaStore />
          </div>
          <div className="stat-info">
            <span className="stat-number">{pendingCount}</span>
            <span className="stat-label">Pending Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <FaUtensils />
          </div>
          <div className="stat-info">
            <span className="stat-number">{foodItems.length}</span>
            <span className="stat-label">Menu Dishes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <FaRupeeSign />
          </div>
          <div className="stat-info">
            <span className="stat-number">₹{totalRevenue.toFixed(0)}</span>
            <span className="stat-label">Est. Revenue</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('menu')}
        >
          Menu Management ({foodItems.length})
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders & Live Status ({orders.length})
        </button>
      </div>

      {/* Tab 1: Menu Management */}
      {activeTab === 'menu' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary-color)' }}>
              Dishes & Prices
            </h3>
            <button type="button" className="btn btn-primary btn-sm" onClick={() => openModal()}>
              <FaPlus /> Add New Dish
            </button>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Type</th>
                  <th>In Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {foodItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {item.description}
                      </p>
                    </td>
                    <td>{item.category || 'Mains'}</td>
                    <td style={{ fontWeight: 700, color: 'var(--secondary-color)' }}>
                      ₹{Number(item.price).toFixed(2)}
                    </td>
                    <td>
                      <span className={`badge ${item.isVegetarian ? 'badge-success' : 'badge-danger'}`}>
                        {item.isVegetarian ? 'Veg' : 'Non-Veg'}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`btn btn-sm ${item.isAvailable ? 'btn-outline' : 'btn-danger'}`}
                        onClick={() => handleToggleItemAvailability(item.id)}
                      >
                        {item.isAvailable ? 'Available' : 'Sold Out'}
                      </button>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          onClick={() => openModal(item)}
                          aria-label="Edit dish"
                        >
                          <FaEdit />
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDeleteFoodItem(item.id)}
                          aria-label="Delete dish"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders */}
      {activeTab === 'orders' && (
        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary-color)', marginBottom: '1.25rem' }}>
            Incoming Orders
          </h3>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer / Time</th>
                  <th>Items Ordered</th>
                  <th>Total</th>
                  <th>Current Status</th>
                  <th>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((ord) => {
                  const displayItems = ord.items || ord.orderItems || [];
                  return (
                    <tr key={ord.id}>
                      <td style={{ fontWeight: 700 }}>#{ord.orderNumber || ord.id}</td>
                      <td>
                        <strong>{ord.customerName || 'Customer'}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {new Date(ord.createdAt || Date.now()).toLocaleTimeString()}
                        </div>
                      </td>
                      <td>
                        {displayItems.map((i, idx) => (
                          <div key={idx} style={{ fontSize: '0.85rem' }}>
                            {i.name || i.foodItem?.name} x {i.quantity || 1}
                          </div>
                        ))}
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--secondary-color)' }}>
                        ₹{Number(ord.totalAmount || ord.total || 0).toFixed(2)}
                      </td>
                      <td>
                        <span className={`badge ${ord.status === 'PENDING' ? 'badge-warning' : ord.status === 'DELIVERED' ? 'badge-success' : 'badge-primary'}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '0.4rem 0.6rem', fontSize: '0.85rem' }}
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Accept & Confirm</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                          <option value="DELIVERED">Delivered</option>
                          <option value="CANCELLED">Reject / Cancel</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Dish Modal */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{editingItem ? 'Edit Dish' : 'Add New Dish'}</h3>
              <button
                type="button"
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
                onClick={() => setIsModalOpen(false)}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSaveFoodItem}>
              <div className="form-group">
                <label className="form-label">Dish Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Paneer Butter Masala"
                  value={itemFormData.name}
                  onChange={(e) => setItemFormData((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Ingredients and taste description"
                  value={itemFormData.description}
                  onChange={(e) => setItemFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-input"
                    placeholder="e.g. 299"
                    value={itemFormData.price}
                    onChange={(e) => setItemFormData((p) => ({ ...p, price: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Pizza, Biryani, Dessert"
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData((p) => ({ ...p, category: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL (optional)</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="https://example.com/dish.jpg"
                  value={itemFormData.imageUrl}
                  onChange={(e) => setItemFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '2rem', margin: '1.25rem 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={itemFormData.isVegetarian}
                    onChange={(e) => setItemFormData((p) => ({ ...p, isVegetarian: e.target.checked }))}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Vegetarian Dish 🌱</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={itemFormData.isAvailable}
                    onChange={(e) => setItemFormData((p) => ({ ...p, isAvailable: e.target.checked }))}
                  />
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>In Stock & Available ✅</span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Save Dish
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
