const Score = require('../models/Score');
const User = require('../models/User');

/**
 * Get overall leaderboard
 * @route GET /api/leaderboard
 * @access Private
 */
const getLeaderboard = async (req, res) => {
    try {
        const { limit = 10, category } = req.query;

        let query = {};

        // If category specified, filter by category
        if (category && category !== 'all') {
            const Quiz = require('../models/Quiz');
            const categoryQuizzes = await Quiz.find({ category }).select('_id');
            const quizIds = categoryQuizzes.map(q => q._id);
            query.quiz = { $in: quizIds };
        }

        // Get top scorers
        const topScores = await Score.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    quizzesTaken: { $sum: 1 },
                    averagePercentage: { $avg: '$percentage' }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: parseInt(limit) }
        ]);

        // Populate user details
        const leaderboard = await Promise.all(
            topScores.map(async (entry, index) => {
                const user = await User.findById(entry._id).select('username skillLevel');
                return {
                    rank: index + 1,
                    username: user?.username || 'Unknown',
                    skillLevel: user?.skillLevel || 'Beginner',
                    totalScore: entry.totalScore,
                    quizzesTaken: entry.quizzesTaken,
                    averagePercentage: Math.round(entry.averagePercentage)
                };
            })
        );

        // Get current user's rank
        let userRank = null;
        if (req.user) {
            const allScores = await Score.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: '$user',
                        totalScore: { $sum: '$score' }
                    }
                },
                { $sort: { totalScore: -1 } }
            ]);

            const userIndex = allScores.findIndex(
                s => s._id.toString() === req.user._id.toString()
            );

            if (userIndex !== -1) {
                userRank = {
                    rank: userIndex + 1,
                    totalScore: allScores[userIndex].totalScore
                };
            }
        }

        res.json({
            success: true,
            data: {
                leaderboard,
                userRank
            }
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
};

/**
 * Get leaderboard by category
 * @route GET /api/leaderboard/category/:category
 * @access Private
 */
const getLeaderboardByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { limit = 10 } = req.query;

        const Quiz = require('../models/Quiz');
        const categoryQuizzes = await Quiz.find({ category }).select('_id');
        const quizIds = categoryQuizzes.map(q => q._id);

        const topScores = await Score.aggregate([
            { $match: { quiz: { $in: quizIds } } },
            {
                $group: {
                    _id: '$user',
                    totalScore: { $sum: '$score' },
                    quizzesTaken: { $sum: 1 },
                    averagePercentage: { $avg: '$percentage' }
                }
            },
            { $sort: { totalScore: -1 } },
            { $limit: parseInt(limit) }
        ]);

        const leaderboard = await Promise.all(
            topScores.map(async (entry, index) => {
                const user = await User.findById(entry._id).select('username skillLevel');
                return {
                    rank: index + 1,
                    username: user?.username || 'Unknown',
                    skillLevel: user?.skillLevel || 'Beginner',
                    totalScore: entry.totalScore,
                    quizzesTaken: entry.quizzesTaken,
                    averagePercentage: Math.round(entry.averagePercentage)
                };
            })
        );

        res.json({
            success: true,
            category,
            data: leaderboard
        });
    } catch (error) {
        console.error('Get category leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching category leaderboard',
            error: error.message
        });
    }
};

module.exports = {
    getLeaderboard,
    getLeaderboardByCategory
};
