const mongoose = require('mongoose');

/**
 * Quiz Schema
 * Represents a structured test with multiple questions
 */
const quizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning', 'boolean-logic', 'algorithmic-logic', 'mixed']
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question'
    }],
    timeLimit: {
        type: Number, // in minutes
        required: true,
        default: 30
    },
    passingScore: {
        type: Number, // percentage
        default: 60
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard', 'mixed'],
        default: 'medium'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
