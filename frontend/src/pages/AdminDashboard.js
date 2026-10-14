import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUsers,
  FaStore,
  FaReceipt,
  FaRupeeSign,
  FaTrash,
  FaPlus,
  FaTags,
  FaUserShield,
} from 'react-icons/fa';
import userService from '../services/userService';
import restaurantService from '../services/restaurantService';
import orderService from '../services/orderService';
import foodService from '../services/foodService';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import './AdminDashboard.css';

const DEFAULT_USERS = [
  { id: 1, name: 'Anshika Reddy', email: 'anshika@example.com', role: 'ADMIN', phone: '9876543210' },
  { id: 2, name: 'Vikram Mehta', email: 'owner@demo.com', role: 'RESTAURANT_OWNER', phone: '9876543211' },
  { id: 3, name: 'Pooja Nair', email: 'customer@demo.com', role: 'CUSTOMER', phone: '9876543212' },
  { id: 4, name: 'Rohan Sen', email: 'rohan@example.com', role: 'CUSTOMER', phone: '9876543213' },
];

const DEFAULT_RESTAURANTS = [
  { id: 1, name: 'Spice Symphony', cuisineType: 'North Indian, Biryani', address: 'Indiranagar, Bangalore', isOpen: true, rating: 4.6 },
  { id: 2, name: 'Pizzeria Bella', cuisineType: 'Italian, Pizza, Pasta', address: 'Koramangala, Bangalore', isOpen: true, rating: 4.8 },
  { id: 3, name: 'Dragon Wok Express', cuisineType: 'Chinese, Asian', address: 'HSR Layout, Bangalore', isOpen: false, rating: 4.4 },
];

const DEFAULT_ORDERS = [
  { id: 101, orderNumber: 'ORD-101', customerName: 'Pooja Nair', restaurantName: 'Pizzeria Bella', totalAmount: 499, status: 'DELIVERED', createdAt: '2026-10-14T11:00:00Z' },
  { id: 102, orderNumber: 'ORD-102', customerName: 'Rohan Sen', restaurantName: 'Spice Symphony', totalAmount: 720, status: 'PREPARING', createdAt: '2026-10-14T12:15:00Z' },
  { id: 103, orderNumber: 'ORD-103', customerName: 'Anshika Reddy', restaurantName: 'Dragon Wok Express', totalAmount: 380, status: 'PENDING', createdAt: '2026-10-14T13:00:00Z' },
];

const DEFAULT_CATEGORIES = ['Biryani', 'Pizza', 'Burger', 'Chinese', 'Italian', 'Healthy', 'Desserts', 'Beverages'];

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // Category add form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  const loadAdminData = useCallback(async () => {
    setLoading(true);
    try {
      try {
        const u = await userService.getAllUsers();
        setUsers(Array.isArray(u) && u.length > 0 ? u : DEFAULT_USERS);
      } catch (e) {
        setUsers(DEFAULT_USERS);
      }

      try {
        const r = await restaurantService.getAllRestaurants();
        setRestaurants(Array.isArray(r) && r.length > 0 ? r : DEFAULT_RESTAURANTS);
      } catch (e) {
        setRestaurants(DEFAULT_RESTAURANTS);
      }

      try {
        const o = await orderService.getAllOrders();
        setOrders(Array.isArray(o) && o.length > 0 ? o : DEFAULT_ORDERS);
      } catch (e) {
        setOrders(DEFAULT_ORDERS);
      }

      try {
        const c = await foodService.getAllCategories();
        setCategories(Array.isArray(c) && c.length > 0 ? c : DEFAULT_CATEGORIES);
      } catch (e) {
        setCategories(DEFAULT_CATEGORIES);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // User Actions
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await userService.deleteUser(id);
    } catch (e) {
      console.warn('Backend delete error:', e);
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.info('User removed');
  };

  // Restaurant Actions
  const handleToggleRestaurant = async (id) => {
    try {
      await restaurantService.toggleStatus(id);
    } catch (e) {
      console.warn('Status toggle error:', e);
    }
    setRestaurants((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isOpen: !r.isOpen } : r))
    );
    toast.info('Restaurant status updated');
  };

  // Order Actions
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success(`Order status changed to ${status}`);
    } catch (e) {
      console.warn('Order status error:', e);
    }
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  };

  // Category Actions
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    const existingName = categories.find(
      (c) => (typeof c === 'string' ? c : c.name).toLowerCase() === newCategoryName.trim().toLowerCase()
    );
    if (existingName) {
      toast.warn('Category already exists');
      return;
    }
    try {
      const result = await foodService.createCategory({ name: newCategoryName.trim() });
      const newCat = result?.data || { name: newCategoryName.trim() };
      setCategories((prev) => [...prev, newCat]);
      toast.success('Category added!');
    } catch (err) {
      console.error('Failed to create category:', err);
      toast.error('Failed to create category');
    }
    setNewCategoryName('');
    setShowAddCat(false);
  };

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${typeof cat === 'string' ? cat : cat.name}"?`)) return;
    const catId = typeof cat === 'string' ? null : cat.id;
    try {
      if (catId) {
        await foodService.deleteCategory(catId);
      }
      setCategories((prev) => prev.filter((c) => c !== cat && (typeof c === 'string' ? c : c.id) !== catId));
      toast.info('Category removed');
    } catch (err) {
      console.error('Failed to delete category:', err);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading Admin Control Panel..." />;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-header">
        <div>
          <h1 className="page-title">
            <FaUserShield style={{ color: '#004E89' }} /> Admin Dashboard
          </h1>
          <p className="page-subtitle">Platform overview, user accounts, and vendor management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="dashboard-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-blue">
            <FaUsers />
          </div>
          <div className="stat-info">
            <span className="stat-number">{users.length}</span>
            <span className="stat-label">Total Users</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-orange">
            <FaStore />
          </div>
          <div className="stat-info">
            <span className="stat-number">{restaurants.length}</span>
            <span className="stat-label">Restaurants</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-yellow">
            <FaReceipt />
          </div>
          <div className="stat-info">
            <span className="stat-number">{orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper stat-icon-green">
            <FaRupeeSign />
          </div>
          <div className="stat-info">
            <span className="stat-number">₹{totalRevenue.toFixed(0)}</span>
            <span className="stat-label">Gross Revenue</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users ({users.length})
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'restaurants' ? 'active' : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants ({restaurants.length})
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders ({orders.length})
        </button>
        <button
          type="button"
          className={`dash-tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categories ({categories.length})
        </button>
      </div>

      {/* Tab: Users */}
      {activeTab === 'users' && (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>#{u.id}</td>
                  <td><strong>{u.name}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.phone || 'N/A'}</td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'ADMIN'
                          ? 'badge-danger'
                          : u.role === 'RESTAURANT_OWNER'
                          ? 'badge-warning'
                          : 'badge-primary'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.role !== 'ADMIN' && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteUser(u.id)}
                        aria-label="Delete user"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Restaurants */}
      {activeTab === 'restaurants' && (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Restaurant</th>
                <th>Cuisine</th>
                <th>Location</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((rest) => (
                <tr key={rest.id}>
                  <td><strong>{rest.name}</strong></td>
                  <td>{rest.cuisineType || rest.cuisine}</td>
                  <td>{rest.address}</td>
                  <td>⭐ {Number(rest.rating || 4.5).toFixed(1)}</td>
                  <td>
                    <span className={`badge ${rest.isOpen ? 'badge-success' : 'badge-danger'}`}>
                      {rest.isOpen ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleToggleRestaurant(rest.id)}
                    >
                      {rest.isOpen ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Restaurant</th>
                <th>Total</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td style={{ fontWeight: 700 }}>#{ord.orderNumber || ord.id}</td>
                  <td>{ord.customerName || 'Customer'}</td>
                  <td>{ord.restaurantName || 'Restaurant'}</td>
                  <td style={{ fontWeight: 700, color: 'var(--secondary-color)' }}>
                    ₹{Number(ord.totalAmount || ord.total || 0).toFixed(2)}
                  </td>
                  <td>
                    <span className="badge badge-primary">{ord.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Categories */}
      {activeTab === 'categories' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary-color)' }}>
              Food Categories
            </h3>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setShowAddCat(!showAddCat)}
            >
              <FaPlus /> Add Category
            </button>
          </div>

          {showAddCat && (
            <form
              onSubmit={handleAddCategory}
              style={{
                display: 'flex',
                gap: '0.75rem',
                margin: '1.25rem 0',
                maxWidth: '450px',
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="Category name (e.g. Desserts)"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Save
              </button>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowAddCat(false)}
              >
                Cancel
              </button>
            </form>
          )}

          <div className="admin-categories-grid">
            {categories.map((cat, idx) => (
              <div key={idx} className="admin-category-card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FaTags style={{ color: '#FF6B35' }} />
                  <span className="category-title-text">{typeof cat === 'string' ? cat : cat.name}</span>
                </div>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}
                  onClick={() => handleDeleteCategory(typeof cat === 'string' ? cat : cat.name)}
                  aria-label="Delete category"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
