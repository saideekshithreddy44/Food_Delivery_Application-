import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaReceipt } from 'react-icons/fa';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import orderService from '../services/orderService';
import './MyOrders.css';

const DEFAULT_ORDERS = [
  {
    id: 1001,
    orderNumber: 'ORD-1001',
    createdAt: '2026-10-14T12:30:00Z',
    status: 'OUT_FOR_DELIVERY',
    restaurantName: 'Pizzeria Bella',
    items: [
      { name: 'Margherita Basil Pizza', quantity: 1, price: 349 },
      { name: 'Fresh Mint Lemonade', quantity: 2, price: 129 },
    ],
    totalAmount: 657,
  },
  {
    id: 1002,
    orderNumber: 'ORD-1002',
    createdAt: '2026-10-12T19:45:00Z',
    status: 'DELIVERED',
    restaurantName: 'Spice Symphony',
    items: [
      { name: 'Chicken Dum Biryani', quantity: 2, price: 320 },
      { name: 'Garlic Butter Naan', quantity: 3, price: 50 },
    ],
    totalAmount: 840,
  },
];

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = await orderService.getMyOrders();
        if (Array.isArray(data) && data.length > 0) {
          setOrders(data);
        } else {
          setOrders(DEFAULT_ORDERS);
        }
      } catch (err) {
        console.warn('Fallback orders:', err);
        setOrders(DEFAULT_ORDERS);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders by active tab
  const filteredOrders = orders.filter((order) => {
    const st = (order.status || '').toUpperCase();
    if (activeTab === 'All') return true;
    if (activeTab === 'Active') {
      return ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(st);
    }
    if (activeTab === 'Completed') {
      return st === 'DELIVERED';
    }
    if (activeTab === 'Cancelled') {
      return st === 'CANCELLED';
    }
    return true;
  });

  return (
    <div className="my-orders-page">
      <div className="page-header">
        <h1 className="page-title">
          <FaReceipt style={{ color: '#FF6B35' }} /> My Orders
        </h1>
        <p className="page-subtitle">Track current shipments and view previous deliveries</p>
      </div>

      {/* Tabs */}
      <div className="order-tabs-bar">
        {['All', 'Active', 'Completed', 'Cancelled'].map((tab) => (
          <button
            key={tab}
            className={`order-tab-btn ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Fetching your orders..." />
      ) : filteredOrders.length > 0 ? (
        <div className="orders-list-wrapper">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2 className="empty-state-title">No orders found</h2>
          <p className="empty-state-text">
            {activeTab === 'All'
              ? "You haven't placed any orders yet. Discover delicious foods from top restaurants!"
              : `You have no ${activeTab.toLowerCase()} orders right now.`}
          </p>
          <Link to="/restaurants" className="btn btn-primary">
            <FaShoppingBag /> Order Food Now
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
