import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading Spinner Component
 */
const LoadingSpinner = ({ size = 'medium', message }) => {
    return (
        <div className="loading-container">
            <div className={`loading-spinner loading-spinner-${size}`}></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
