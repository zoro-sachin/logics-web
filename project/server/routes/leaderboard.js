const express = require('express');
const router = express.Router();
const { getLeaderboard, getLeaderboardByCategory } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/leaderboard
 * @desc    Get overall leaderboard
 * @access  Private
 */
router.get('/', protect, getLeaderboard);

/**
 * @route   GET /api/leaderboard/category/:category
 * @desc    Get leaderboard by category
 * @access  Private
 */
router.get('/category/:category', protect, getLeaderboardByCategory);

module.exports = router;
