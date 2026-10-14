import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaHeart } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">
              🍔 Food<span className="brand-orange">Express</span>
            </div>
            <p className="footer-desc">
              Satisfying your cravings around the clock with delicious food prepared with love and delivered with speed.
            </p>
            <div className="footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-link" aria-label="LinkedIn">
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/restaurants">Browse Restaurants</Link>
              <Link to="/cart">My Cart</Link>
              <Link to="/my-orders">Order History</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">Popular Cuisines</h4>
            <div className="footer-links">
              <Link to="/restaurants?cuisine=Pizza">Italian & Pizza</Link>
              <Link to="/restaurants?cuisine=Biryani">Hyderabadi Biryani</Link>
              <Link to="/restaurants?cuisine=Burger">Burgers & Fast Food</Link>
              <Link to="/restaurants?cuisine=Chinese">Chinese & Asian</Link>
            </div>
          </div>

          <div>
            <h4 className="footer-col-title">For Partners</h4>
            <div className="footer-links">
              <Link to="/register">Add Restaurant</Link>
              <Link to="/owner/dashboard">Restaurant Dashboard</Link>
              <Link to="/login">Partner Login</Link>
              <Link to="/profile">Help & Support</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} FoodExpress Delivery Inc. All rights reserved.</p>
          <p>
            Crafted with <FaHeart style={{ color: '#FF6B35', verticalAlign: 'middle' }} /> for food lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
