import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome } from 'react-icons/fa';
import './NotFound.css';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-emoji">🌮🔍</div>
        <div className="not-found-code">404</div>
        <h1 className="not-found-title">Oops! Page Devoured</h1>
        <p className="not-found-desc">
          Looks like someone ate this page before it could be delivered to you. Let's get you back to fresh meals!
        </p>
        <Link to="/" className="btn btn-primary btn-lg">
          <FaHome /> Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
