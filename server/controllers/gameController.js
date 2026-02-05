const Game = require('../models/Game');
const User = require('../models/User');

// @desc    Start a new game session
// @route   POST /api/games/start
// @access  Private
exports.startGame = async (req, res) => {
    try {
        const { gameType, difficulty } = req.body;

        if (!gameType || !difficulty) {
            return res.status(400).json({
                success: false,
                message: 'Game type and difficulty are required'
            });
        }

        // Return game configuration based on type and difficulty
        const config = getGameConfig(gameType, difficulty);

        res.json({
            success: true,
            config
        });
    } catch (error) {
        console.error('Start game error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to start game'
        });
    }
};

// @desc    Submit game result
// @route   POST /api/games/submit
// @access  Private
exports.submitGame = async (req, res) => {
    try {
        const { gameType, difficulty, score, maxScore, timeSpent, gameData } = req.body;

        if (!gameType || !difficulty || score === undefined || !maxScore || !timeSpent) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // Calculate accuracy
        const accuracy = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;

        // Create game record
        const game = await Game.create({
            userId: req.user.id,
            gameType,
            difficulty,
            score,
            maxScore,
            accuracy,
            timeSpent,
            gameData: gameData || {},
            completed: true
        });

        // Update user statistics
        await updateUserGameStats(req.user.id, gameType, score, accuracy);

        res.status(201).json({
            success: true,
            data: game,
            message: 'Game result saved successfully'
        });
    } catch (error) {
        console.error('Submit game error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to save game result'
        });
    }
};

// @desc    Get user's game history
// @route   GET /api/games/history
// @access  Private
exports.getGameHistory = async (req, res) => {
    try {
        const { gameType, limit = 20 } = req.query;

        const query = { userId: req.user.id };
        if (gameType) {
            query.gameType = gameType;
        }

        const games = await Game.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .select('-gameData');

        // Get user's best scores
        const bestScores = await Game.getUserBestScores(req.user.id);

        res.json({
            success: true,
            data: {
                history: games,
                bestScores
            }
        });
    } catch (error) {
        console.error('Get game history error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch game history'
        });
    }
};

// @desc    Get game leaderboard
// @route   GET /api/games/leaderboard/:gameType
// @access  Public
exports.getLeaderboard = async (req, res) => {
    try {
        const { gameType } = req.params;
        const { limit = 100 } = req.query;

        if (!['memory-matrix', 'pattern-recognition', 'time-attack'].includes(gameType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid game type'
            });
        }

        const leaderboard = await Game.getLeaderboard(gameType, parseInt(limit));

        // Add rank to each entry
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
        }));

        res.json({
            success: true,
            data: rankedLeaderboard
        });
    } catch (error) {
        console.error('Get leaderboard error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard'
        });
    }
};

// @desc    Get user's game statistics
// @route   GET /api/games/stats
// @access  Private
exports.getGameStats = async (req, res) => {
    try {
        const stats = await Game.aggregate([
            { $match: { userId: req.user._id } },
            {
                $group: {
                    _id: '$gameType',
                    totalGames: { $sum: 1 },
                    avgScore: { $avg: '$score' },
                    avgAccuracy: { $avg: '$accuracy' },
                    avgTime: { $avg: '$timeSpent' },
                    bestScore: { $max: '$score' }
                }
            }
        ]);

        res.json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Get game stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch game statistics'
        });
    }
};

// Helper function to get game configuration
function getGameConfig(gameType, difficulty) {
    const configs = {
        'memory-matrix': {
            easy: { gridSize: 3, flashTime: 2000, tiles: 3 },
            medium: { gridSize: 4, flashTime: 1500, tiles: 5 },
            hard: { gridSize: 5, flashTime: 1000, tiles: 8 }
        },
        'pattern-recognition': {
            easy: { patternLength: 3, options: 4, timeLimit: 30 },
            medium: { patternLength: 5, options: 4, timeLimit: 25 },
            hard: { patternLength: 7, options: 6, timeLimit: 20 }
        },
        'time-attack': {
            easy: { questionsCount: 5, timeLimit: 60, difficulty: 'easy' },
            medium: { questionsCount: 8, timeLimit: 90, difficulty: 'medium' },
            hard: { questionsCount: 10, timeLimit: 120, difficulty: 'hard' }
        }
    };

    return configs[gameType]?.[difficulty] || {};
}

// Helper function to update user game statistics
async function updateUserGameStats(userId, gameType, score, accuracy) {
    try {
        const user = await User.findById(userId);
        if (!user) return;

        if (!user.gamesPlayed) {
            user.gamesPlayed = [];
        }

        // Update or add game stats
        const gameIndex = user.gamesPlayed.findIndex(g => g.gameType === gameType);
        if (gameIndex >= 0) {
            user.gamesPlayed[gameIndex].totalPlayed += 1;
            user.gamesPlayed[gameIndex].bestScore = Math.max(
                user.gamesPlayed[gameIndex].bestScore || 0,
                score
            );
            user.gamesPlayed[gameIndex].avgAccuracy =
                (user.gamesPlayed[gameIndex].avgAccuracy + accuracy) / 2;
        } else {
            user.gamesPlayed.push({
                gameType,
                totalPlayed: 1,
                bestScore: score,
                avgAccuracy: accuracy
            });
        }

        user.lastActive = new Date();
        await user.save();
    } catch (error) {
        console.error('Update user game stats error:', error);
    }
}
