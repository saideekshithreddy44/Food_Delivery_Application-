import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCheck, FaMotorcycle, FaArrowRight, FaShoppingBag } from 'react-icons/fa';
import orderService from '../services/orderService';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrderDetails(data);
      } catch (err) {
        // Fallback display with params id
        setOrderDetails({
          id,
          orderNumber: `ORD-${id}`,
          status: 'PENDING',
          estimatedDelivery: '30-40 minutes',
        });
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const displayOrderNumber = orderDetails?.orderNumber || `ORD-${id}`;
  const totalAmount = orderDetails?.totalAmount || orderDetails?.total;

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-card">
        <div className="celebration-icon-wrapper">
          <FaCheck />
        </div>

        <h1 className="confirmation-title">Order Confirmed! 🎉</h1>
        <p className="confirmation-subtitle">
          Your delicious meal is now being forwarded to the restaurant kitchen.
        </p>

        <div className="order-info-pill-container">
          <div className="info-pill-item">
            <span className="info-pill-label">Order Number</span>
            <span className="info-pill-value">#{displayOrderNumber}</span>
          </div>

          <div className="info-pill-item">
            <span className="info-pill-label">Status</span>
            <span className="info-pill-value" style={{ color: '#F39C12' }}>
              Pending
            </span>
          </div>

          {totalAmount && (
            <div className="info-pill-item">
              <span className="info-pill-label">Total Amount</span>
              <span className="info-pill-value">₹{Number(totalAmount).toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="delivery-estimate-box">
          <FaMotorcycle style={{ fontSize: '1.4rem' }} />
          <span>Estimated Delivery Time: 30 - 45 Minutes</span>
        </div>

        <div className="confirmation-actions">
          <Link to={`/orders/${id}`} className="btn btn-primary btn-lg">
            Track Live Order <FaArrowRight />
          </Link>

          <Link to="/restaurants" className="btn btn-outline btn-lg">
            <FaShoppingBag /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
