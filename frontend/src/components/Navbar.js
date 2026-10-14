import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaReceipt,
  FaStore,
  FaUserShield,
  FaChevronDown,
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout, isOwner, isAdmin, isCustomer } = useAuth();
  const { cartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
          🍔 Food<span className="brand-orange">Express</span>
        </Link>

        {/* Embedded quick search for medium/desktop */}
        <div className="navbar-search">
          <SearchBar placeholder="Search food or places..." />
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Navigation items */}
        <nav className={`navbar-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/restaurants"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Restaurants
          </NavLink>

          {/* Role specific links */}
          {isAuthenticated && isOwner && (
            <NavLink
              to="/owner/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaStore /> Owner Dashboard
            </NavLink>
          )}

          {isAuthenticated && isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaUserShield /> Admin Panel
            </NavLink>
          )}

          {/* Cart Icon (Customer or Guest) */}
          {(!isAuthenticated || isCustomer) && (
            <Link
              to="/cart"
              className="nav-cart-btn"
              onClick={closeMobileMenu}
              aria-label={`Cart with ${cartCount} items`}
            >
              <FaShoppingCart />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
          )}

          {/* User Auth controls */}
          {isAuthenticated ? (
            <div className="user-menu-wrapper" ref={dropdownRef}>
              <button
                className="user-avatar-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <FaUser />
                <span>{user?.name?.split(' ')[0] || 'My Account'}</span>
                <FaChevronDown style={{ fontSize: '0.7rem' }} />
              </button>

              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-user-name">{user?.name || 'User'}</div>
                    <div className="dropdown-user-role">{user?.role || 'Customer'}</div>
                  </div>

                  <Link to="/profile" className="dropdown-item" onClick={closeMobileMenu}>
                    <FaUser /> My Profile
                  </Link>

                  {isCustomer && (
                    <Link to="/my-orders" className="dropdown-item" onClick={closeMobileMenu}>
                      <FaReceipt /> My Orders
                    </Link>
                  )}

                  {isOwner && (
                    <Link to="/owner/dashboard" className="dropdown-item" onClick={closeMobileMenu}>
                      <FaStore /> Restaurant Dashboard
                    </Link>
                  )}

                  {isAdmin && (
                    <Link to="/admin/dashboard" className="dropdown-item" onClick={closeMobileMenu}>
                      <FaUserShield /> Admin Console
                    </Link>
                  )}

                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link to="/login" className="btn btn-outline btn-sm" onClick={closeMobileMenu}>
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
