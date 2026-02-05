import React from 'react';
import { FaFire } from 'react-icons/fa';
import './Gamification.css';

/**
 * Streak Indicator Component
 * Displays current daily streak with fire animation
 */
const StreakIndicator = ({ streak = 0 }) => {
    return (
        <div className="streak-container" title="Daily Streak">
            <div className={`streak-icon-wrapper ${streak > 0 ? 'active' : ''}`}>
                <FaFire className="streak-icon" />
            </div>
            <div className="streak-info">
                <span className="streak-count">{streak}</span>
                <span className="streak-label">Day Streak</span>
            </div>
        </div>
    );
};

export default StreakIndicator;
