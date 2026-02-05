import React from 'react';
import { FaStar } from 'react-icons/fa';
import './Gamification.css';

/**
 * XP Progress Bar Component
 * Displays current level, XP, and progress to next level
 */
const XPProgressBar = ({ xp = 0, level = 1 }) => {
    // Calculate progress based on simple level formula
    // Level N starts at: 100 * (N-1)^2 XP
    // Level N+1 starts at: 100 * N^2 XP

    const currentLevelStart = 100 * Math.pow(level - 1, 2);
    const nextLevelStart = 100 * Math.pow(level, 2);
    const xpNeededForLevel = nextLevelStart - currentLevelStart;
    const currentLevelXP = xp - currentLevelStart;

    // Progress percentage
    const progress = Math.min(Math.max((currentLevelXP / xpNeededForLevel) * 100, 0), 100);

    return (
        <div className="xp-container">
            <div className="level-badge">
                <span className="level-label">LVL</span>
                <span className="level-value">{level}</span>
            </div>
            <div className="xp-details">
                <div className="xp-header">
                    <span className="xp-title">
                        <FaStar className="xp-icon" /> Experience
                    </span>
                    <span className="xp-values">
                        {Math.floor(currentLevelXP)} / {xpNeededForLevel} XP
                    </span>
                </div>
                <div className="xp-bar-bg">
                    <div
                        className="xp-bar-fill"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default XPProgressBar;
