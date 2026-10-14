import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ text = 'Loading delicious food...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
