const mongoose = require('mongoose');

/**
 * Score Schema
 * Tracks quiz attempts and results for each user
 */
const scoreSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: false // Optional for dynamic quizzes
    },
    category: {
        type: String,
        required: false
    },
    difficulty: {
        type: String,
        required: false
    },
    isDynamic: {
        type: Boolean,
        default: false
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    totalPoints: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    },
    timeSpent: {
        type: Number, // in seconds
        required: true
    },
    answers: [{
        question: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Question'
        },
        selectedAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number // time spent on this question
    }],
    passed: {
        type: Boolean,
        required: true
    },
    completedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for leaderboard queries
scoreSchema.index({ quiz: 1, score: -1 });
scoreSchema.index({ user: 1, completedAt: -1 });

module.exports = mongoose.model('Score', scoreSchema);
