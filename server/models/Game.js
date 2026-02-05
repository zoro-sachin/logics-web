const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    gameType: {
        type: String,
        enum: ['memory-matrix', 'pattern-recognition', 'time-attack'],
        required: true,
        index: true
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    maxScore: {
        type: Number,
        required: true
    },
    accuracy: {
        type: Number,
        min: 0,
        max: 100
    },
    timeSpent: {
        type: Number, // in seconds
        required: true
    },
    completed: {
        type: Boolean,
        default: true
    },
    gameData: {
        type: mongoose.Schema.Types.Mixed, // Store game-specific data
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Compound index for leaderboard queries
gameSchema.index({ gameType: 1, score: -1, createdAt: -1 });
gameSchema.index({ userId: 1, createdAt: -1 });

// Virtual for performance percentage
gameSchema.virtual('performancePercentage').get(function () {
    return this.maxScore > 0 ? Math.round((this.score / this.maxScore) * 100) : 0;
});

// Static method to get leaderboard
gameSchema.statics.getLeaderboard = async function (gameType, limit = 100) {
    return this.aggregate([
        { $match: { gameType, completed: true } },
        { $sort: { score: -1, timeSpent: 1 } },
        { $limit: limit },
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $project: {
                score: 1,
                timeSpent: 1,
                difficulty: 1,
                createdAt: 1,
                'user.username': 1,
                'user.email': 1
            }
        }
    ]);
};

// Static method to get user's best scores
gameSchema.statics.getUserBestScores = async function (userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), completed: true } },
        { $sort: { score: -1 } },
        {
            $group: {
                _id: '$gameType',
                bestScore: { $first: '$score' },
                bestTime: { $first: '$timeSpent' },
                difficulty: { $first: '$difficulty' },
                playedAt: { $first: '$createdAt' }
            }
        }
    ]);
};

module.exports = mongoose.model('Game', gameSchema);
