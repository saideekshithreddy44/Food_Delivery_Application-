import React, { useState } from 'react';
import { FaStar, FaRegStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({
  rating = 0,
  maxStars = 5,
  interactive = false,
  onChange = () => {},
  showValue = false,
  size = 'medium',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (interactive) {
      onChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (interactive) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  const currentRating = hoverRating || Math.round(rating);

  return (
    <div className={`star-rating size-${size}`}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= currentRating;

        return (
          <span
            key={index}
            className={`star-icon ${isFilled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
            role={interactive ? 'button' : 'img'}
            aria-label={`${starValue} star`}
          >
            {isFilled ? <FaStar /> : <FaRegStar />}
          </span>
        );
      })}
      {showValue && <span className="rating-value">{Number(rating).toFixed(1)}</span>}
    </div>
  );
};

export default StarRating;
