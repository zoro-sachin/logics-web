const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProgress, getStats } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/users/progress
 * @desc    Update user progress
 * @access  Private
 */
router.put(
    '/progress',
    protect,
    [
        body('category')
            .isIn(['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning'])
            .withMessage('Invalid category'),
        body('points')
            .isInt({ min: 0 })
            .withMessage('Points must be a positive number')
    ],
    validate,
    updateProgress
);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', protect, getStats);

module.exports = router;
