const express = require('express');
const router = express.Router();
const {
    getOverview,
    getStrengths,
    getActivity,
    getTrends,
    getRecentActivity
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

// All analytics routes are protected
router.get('/overview', protect, getOverview);
router.get('/strengths', protect, getStrengths);
router.get('/activity', protect, getActivity);
router.get('/trends', protect, getTrends);
router.get('/recent', protect, getRecentActivity);

module.exports = router;
