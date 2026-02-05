const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * Stores user account information, progress, and statistics
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default in queries
    },
    skillLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
        default: 'Beginner'
    },
    totalScore: {
        type: Number,
        default: 0
    },
    badges: [{
        name: String,
        earnedAt: {
            type: Date,
            default: Date.now
        }
    }],
    progress: {
        numberSeries: { type: Number, default: 0 },
        patterns: { type: Number, default: 0 },
        puzzles: { type: Number, default: 0 },
        aptitude: { type: Number, default: 0 },
        reasoning: { type: Number, default: 0 }
    },
    currentLevel: {
        type: Number,
        default: 1
    },
    levelProgress: {
        type: Number,
        default: 0
    },
    questionsNeededForLevel: {
        type: Number,
        default: 5
    },
    // New Gamification Fields
    xp: {
        type: Number,
        default: 0
    },
    streak: {
        type: Number,
        default: 0
    },
    lastActiveDate: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Gamification Methods

// Gain XP and handle leveling
userSchema.methods.gainXp = function (amount) {
    this.xp += amount;
    this.totalScore += amount; // Sync total score

    // Simple Leveling Logic: Level = 1 + floor(sqrt(XP / 100))
    // 100 XP = Lvl 2, 400 XP = Lvl 3, 900 XP = Lvl 4...
    const newLevel = 1 + Math.floor(Math.sqrt(this.xp / 100));

    if (newLevel > this.currentLevel) {
        this.currentLevel = newLevel;
        return true; // Leveled up!
    }
    return false;
};

// Update Daily Streak
userSchema.methods.updateStreak = function () {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    if (!this.lastActiveDate) {
        // First time active
        this.streak = 1;
        this.lastActiveDate = now;
        return;
    }

    const last = new Date(this.lastActiveDate);
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate());

    const diffTime = Math.abs(today - lastDay);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        // Already active today, do nothing
        return;
    } else if (diffDays === 1) {
        // Active yesterday, increment streak
        this.streak += 1;
    } else {
        // Missed a day or more, reset
        this.streak = 1;
    }

    this.lastActiveDate = now;
};

module.exports = mongoose.model('User', userSchema);
