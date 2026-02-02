import React from 'react';
import './ErrorMessage.css';

/**
 * Error Message Component
 */
const ErrorMessage = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="error-message">
            <span>{message}</span>
            {onClose && (
                <button className="error-close" onClick={onClose}>
                    ×
                </button>
            )}
        </div>
    );
};

export default ErrorMessage;
