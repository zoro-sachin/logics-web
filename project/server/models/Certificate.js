const mongoose = require('mongoose');

/**
 * Certificate Schema
 * Tracks certificates earned by users
 */
const certificateSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    score: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Score',
        required: true
    },
    certificateId: {
        type: String,
        required: true,
        unique: true
    },
    scoreAchieved: {
        type: Number,
        required: true
    },
    issueDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate unique certificate ID before saving
certificateSchema.pre('save', function (next) {
    if (!this.certificateId) {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        this.certificateId = `CERT-${timestamp}-${random}`;
    }
    next();
});

module.exports = mongoose.model('Certificate', certificateSchema);
