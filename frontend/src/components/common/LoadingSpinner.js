import React from 'react';

const LoadingSpinner = ({ size = 'medium' }) => {
  const sizeClass = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  }[size];

  return (
    <div className={`spinner-container ${sizeClass}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;