const User = require('../models/User');
const { calculateSkillLevel, checkBadges } = require('../utils/helpers');

/**
 * Get user profile
 * @route GET /api/users/profile
 * @access Private
 */
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

/**
 * Update user progress
 * @route PUT /api/users/progress
 * @access Private
 */
const updateProgress = async (req, res) => {
    try {
        const { category, points } = req.body;

        const user = await User.findById(req.user._id);

        // Update category progress
        if (user.progress[category] !== undefined) {
            user.progress[category] += points;
        }

        // Update total score
        const oldScore = user.totalScore;
        user.totalScore += points;

        // Check for new skill level
        const newSkillLevel = calculateSkillLevel(user.totalScore);
        user.skillLevel = newSkillLevel;

        // Check for new badges
        const newBadges = checkBadges(user, user.totalScore);
        if (newBadges.length > 0) {
            user.badges.push(...newBadges);
        }

        await user.save();

        res.json({
            success: true,
            message: 'Progress updated successfully',
            data: {
                progress: user.progress,
                totalScore: user.totalScore,
                skillLevel: user.skillLevel,
                newBadges: newBadges.length > 0 ? newBadges : null
            }
        });
    } catch (error) {
        console.error('Update progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating progress',
            error: error.message
        });
    }
};

/**
 * Get user statistics
 * @route GET /api/users/stats
 * @access Private
 */
const getStats = async (req, res) => {
    try {
        const Score = require('../models/Score');

        const user = await User.findById(req.user._id);

        // Get user's quiz history
        const scores = await Score.find({ user: req.user._id })
            .sort({ completedAt: -1 })
            .limit(10)
            .populate('quiz', 'title category');

        // Calculate stats
        const totalQuizzes = await Score.countDocuments({ user: req.user._id });
        const passedQuizzes = await Score.countDocuments({ user: req.user._id, passed: true });
        const averageScore = scores.length > 0
            ? scores.reduce((sum, s) => sum + s.percentage, 0) / scores.length
            : 0;

        res.json({
            success: true,
            data: {
                user: {
                    username: user.username,
                    skillLevel: user.skillLevel,
                    totalScore: user.totalScore,
                    badges: user.badges,
                    progress: user.progress
                },
                stats: {
                    totalQuizzes,
                    passedQuizzes,
                    averageScore: Math.round(averageScore),
                    recentScores: scores
                }
            }
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

module.exports = {
    getProfile,
    updateProgress,
    getStats
};
