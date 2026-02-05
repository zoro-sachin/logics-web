const User = require('../models/User');
const Game = require('../models/Game');
const Score = require('../models/Score');
const Question = require('../models/Question');

// @desc    Get user analytics overview
// @route   GET /api/analytics/overview
// @access  Private
exports.getOverview = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get total games played
        const totalGames = await Game.countDocuments({ userId });

        // Get total quizzes/questions attempted
        const totalQuestions = await Score.countDocuments({ userId });

        // Get overall accuracy
        const accuracyData = await Score.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: null,
                    avgAccuracy: { $avg: { $multiply: ['$percentage', 100] } },
                    totalCorrect: { $sum: '$correctAnswers' },
                    totalAttempted: { $sum: '$totalQuestions' }
                }
            }
        ]);

        const accuracy = accuracyData.length > 0
            ? Math.round(accuracyData[0].avgAccuracy)
            : 0;

        // Get user's current level/badge info
        const user = await User.findById(userId).select('progress badges totalPoints');

        res.json({
            success: true,
            data: {
                totalGames,
                totalQuestions,
                accuracy,
                level: user?.progress?.level || 'Beginner',
                badges: user?.badges?.length || 0,
                totalPoints: user?.totalPoints || 0
            }
        });
    } catch (error) {
        console.error('Get overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch analytics overview'
        });
    }
};

// @desc    Get strengths and weaknesses by category
// @route   GET /api/analytics/strengths
// @access  Private
exports.getStrengths = async (req, res) => {
    try {
        const categoryPerformance = await Score.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$category',
                    avgAccuracy: { $avg: { $multiply: ['$percentage', 100] } },
                    totalAttempted: { $sum: 1 },
                    totalCorrect: { $sum: '$correctAnswers' }
                }
            },
            { $sort: { avgAccuracy: -1 } }
        ]);

        // Format for radar chart
        const categories = ['Number Series', 'Patterns', 'Puzzles', 'Aptitude', 'Reasoning'];
        const radarData = categories.map(category => {
            const data = categoryPerformance.find(cp => cp._id === category.toLowerCase());
            return {
                category,
                accuracy: data ? Math.round(data.avgAccuracy) : 0,
                attempted: data ? data.totalAttempted : 0
            };
        });

        res.json({
            success: true,
            data: {
                categoryPerformance,
                radarData
            }
        });
    } catch (error) {
        console.error('Get strengths error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch strengths analysis'
        });
    }
};

// @desc    Get activity heatmap data
// @route   GET /api/analytics/activity
// @access  Private
exports.getActivity = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get games activity
        const gamesActivity = await Game.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get quiz/question activity
        const quizActivity = await Score.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: thirtyDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Combine activities
        const activityMap = new Map();

        gamesActivity.forEach(item => {
            activityMap.set(item._id, {
                date: item._id,
                games: item.count,
                quizzes: 0
            });
        });

        quizActivity.forEach(item => {
            if (activityMap.has(item._id)) {
                activityMap.get(item._id).quizzes = item.count;
            } else {
                activityMap.set(item._id, {
                    date: item._id,
                    games: 0,
                    quizzes: item.count
                });
            }
        });

        const activity = Array.from(activityMap.values()).map(item => ({
            ...item,
            total: item.games + item.quizzes
        }));

        res.json({
            success: true,
            data: activity
        });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity data'
        });
    }
};

// @desc    Get performance trends over time
// @route   GET /api/analytics/trends
// @access  Private
exports.getTrends = async (req, res) => {
    try {
        const { period = '30' } = req.query;
        const daysAgo = new Date();
        daysAgo.setDate(daysAgo.getDate() - parseInt(period));

        // Get accuracy trend
        const accuracyTrend = await Score.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: daysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    avgAccuracy: { $avg: { $multiply: ['$percentage', 100] } }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get score trend
        const scoreTrend = await Game.aggregate([
            {
                $match: {
                    userId: req.user._id,
                    createdAt: { $gte: daysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
                    },
                    avgScore: { $avg: '$score' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                accuracyTrend: accuracyTrend.map(item => ({
                    date: item._id,
                    accuracy: Math.round(item.avgAccuracy)
                })),
                scoreTrend: scoreTrend.map(item => ({
                    date: item._id,
                    score: Math.round(item.avgScore)
                }))
            }
        });
    } catch (error) {
        console.error('Get trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch performance trends'
        });
    }
};

// @desc    Get recent activity feed
// @route   GET /api/analytics/recent
// @access  Private
exports.getRecentActivity = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get recent games
        const recentGames = await Game.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) / 2)
            .select('gameType score difficulty createdAt');

        // Get recent quiz attempts
        const recentQuizzes = await Score.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) / 2)
            .select('category percentage difficulty createdAt');

        // Combine and sort
        const activities = [
            ...recentGames.map(g => ({
                type: 'game',
                gameType: g.gameType,
                score: g.score,
                difficulty: g.difficulty,
                createdAt: g.createdAt
            })),
            ...recentQuizzes.map(q => ({
                type: 'quiz',
                category: q.category,
                percentage: Math.round(q.percentage * 100),
                difficulty: q.difficulty,
                createdAt: q.createdAt
            }))
        ].sort((a, b) => b.createdAt - a.createdAt).slice(0, parseInt(limit));

        res.json({
            success: true,
            data: activities
        });
    } catch (error) {
        console.error('Get recent activity error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activity'
        });
    }
};
