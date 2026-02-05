const jwt = require('jsonwebtoken');

/**
 * Generate JWT token for user
 * @param {string} id - User ID
 * @returns {string} JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Token expires in 30 days
    });
};

/**
 * Calculate skill level based on total score
 * @param {number} totalScore - User's total score
 * @returns {string} Skill level
 */
const calculateSkillLevel = (totalScore) => {
    if (totalScore >= 1000) return 'Expert';
    if (totalScore >= 500) return 'Advanced';
    if (totalScore >= 200) return 'Intermediate';
    return 'Beginner';
};

/**
 * Award badges based on achievements
 * @param {Object} user - User object
 * @param {number} newScore - New score achieved
 * @returns {Array} New badges earned
 */
const checkBadges = (user, newScore) => {
    const newBadges = [];

    const badgeThresholds = [
        { threshold: 100, name: 'First Century' },
        { threshold: 500, name: 'Logic Master' },
        { threshold: 1000, name: 'Reasoning Expert' }
    ];

    badgeThresholds.forEach(badge => {
        const alreadyEarned = user.badges.some(b => b.name === badge.name);
        if (!alreadyEarned && user.totalScore >= badge.threshold) {
            newBadges.push({ name: badge.name });
        }
    });

    return newBadges;
};

module.exports = {
    generateToken,
    calculateSkillLevel,
    checkBadges
};
