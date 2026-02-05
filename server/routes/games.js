const express = require('express');
const router = express.Router();
const {
    startGame,
    submitGame,
    getGameHistory,
    getLeaderboard,
    getGameStats
} = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

// Protected routes
router.post('/start', protect, startGame);
router.post('/submit', protect, submitGame);
router.get('/history', protect, getGameHistory);
router.get('/stats', protect, getGameStats);

// Public routes
router.get('/leaderboard/:gameType', getLeaderboard);

module.exports = router;
