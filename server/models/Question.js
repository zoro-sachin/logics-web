const mongoose = require('mongoose');

/**
 * Question Schema
 * Stores both AI-generated and manually created questions
 * AI-generated questions are cached for quiz consistency
 */
const questionSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning', 'boolean-logic', 'algorithmic-logic']
    },
    level: {
        type: Number,
        required: true,
        default: 1
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['easy', 'medium', 'hard']
    },
    questionText: {
        type: String,
        required: true
    },
    options: [{
        type: String,
        required: true
    }],
    correctAnswer: {
        type: String,
        required: true
    },
    explanation: {
        type: String,
        required: true
    },
    points: {
        type: Number,
        default: function () {
            // Award points based on difficulty
            const pointsMap = { easy: 10, medium: 20, hard: 30 };
            return pointsMap[this.difficulty] || 10;
        }
    },
    generatedBy: {
        type: String,
        enum: ['AI', 'manual', 'System'],
        default: 'AI'
    },
    contentHash: {
        type: String,
        index: true
    },
    aiGeneratedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ contentHash: 1, category: 1, difficulty: 1 });

/**
 * Generate a hash fingerprint of question content
 * Used to detect similar/duplicate questions
 */
function generateContentHash(questionText, options) {
    // Extract key numbers and patterns from the question
    const numberPattern = questionText.match(/\d+/g) || [];
    const optionHashParts = options.slice(0, 2).map(opt => opt.substring(0, 10)).join('|');

    // Create a simplified hash
    const simplified = questionText.toLowerCase()
        .replace(/[^\w\s]/g, '') // Remove special chars
        .replace(/\s+/g, ' ') // Normalize spaces
        .substring(0, 100); // First 100 chars

    return simplified + '|' + numberPattern.join('-') + '|' + optionHashParts;
}

/**
 * Check if a question is a duplicate based on content similarity
 */
questionSchema.statics.isDuplicate = async function (questionText, options, category, difficulty) {
    const contentHash = generateContentHash(questionText, options);

    // Check for exact text match first
    const exactMatch = await this.findOne({
        questionText: { $regex: '^' + questionText.trim() + '$', $options: 'i' },
        category,
        difficulty
    });

    if (exactMatch) {
        return true;
    }

    // Check for similar content hash
    const similarMatch = await this.findOne({
        contentHash,
        category,
        difficulty
    });

    if (similarMatch) {
        return true;
    }

    // Check for high similarity in question text (75%+ match)
    // ONLY for descriptive categories where templates aren't used
    if (!['number-series', 'patterns'].includes(category)) {
        const allQuestions = await this.find({ category, difficulty }).select('questionText');
        const similarity = (str1, str2) => {
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;

            if (longer.length === 0) return 1.0;

            const editDistance = getEditDistance(longer, shorter);
            return (longer.length - editDistance) / longer.length;
        };

        for (const q of allQuestions) {
            if (similarity(questionText.toLowerCase(), q.questionText.toLowerCase()) > 0.75) {
                return true;
            }
        }
    }

    return false;
};

/**
 * Calculate edit distance between two strings (Levenshtein)
 */
function getEditDistance(s1, s2) {
    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

/**
 * Store content hash before saving
 */
questionSchema.pre('save', function (next) {
    if (!this.contentHash) {
        this.contentHash = generateContentHash(this.questionText, this.options);
    }
    next();
});

module.exports = mongoose.model('Question', questionSchema);
