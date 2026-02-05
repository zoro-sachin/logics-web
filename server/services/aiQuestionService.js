/**
 * AI Question Service (RECTIFIED)
 * =================================
 * ✔ Uses ONLY questionBank
 * ✔ Random questions
 * ✔ No repetition
 * ✔ No AI / No API
 * ✔ Safe fallback
 */

const questionBank = require('./questionBank');

class AIQuestionService {
    constructor() {
        this.used = {}; // Will store Set per category-difficulty key
    }

    _getUsedKey(category, difficulty) {
        return `${category}:${difficulty}`;
    }

    _getUsedSet(category, difficulty) {
        const key = this._getUsedKey(category, difficulty);
        if (!this.used[key]) {
            this.used[key] = new Set();
        }
        return this.used[key];
    }

    /* ----------------------------------
       LEVEL → DIFFICULTY
    ---------------------------------- */

    getDifficultyForLevel(level) {
        if (level <= 5) return 'easy';
        if (level <= 10) return 'medium';
        return 'hard';
    }

    /* ----------------------------------
       MAIN ENTRY (USED BY APP)
    ---------------------------------- */

    async generateQuestion(category, difficulty) {
        return this.getQuestionFromBank(category, difficulty);
    }

    async generateQuestionsForLevel(category, level, count = 1) {
        const difficulty = this.getDifficultyForLevel(level);

        const questions = [];

        for (let i = 0; i < count; i++) {
            const q = this.getQuestionFromBank(category, difficulty, level);
            if (q) questions.push(q);
        }

        return questions;
    }

    /* ----------------------------------
       CORE LOGIC (NO AI)
    ---------------------------------- */

    getQuestionFromBank(category, difficulty, level = 1) {
        const pool = questionBank.getByCategory(category, difficulty);

        if (!pool || pool.length === 0) {
            throw new Error(`No questions for ${category} - ${difficulty}`);
        }

        const usedSet = this._getUsedSet(category, difficulty);

        // reset if all used
        if (usedSet.size >= pool.length) {
            usedSet.clear();
        }

        // filter unused
        const available = pool.filter(q => {
            const key = JSON.stringify(q);
            return !usedSet.has(key);
        });

        if (available.length === 0) {
            usedSet.clear();
            const picked = pool[Math.floor(Math.random() * pool.length)];
            usedSet.add(JSON.stringify(picked));
            return this.formatQuestion(category, picked, level);
        }

        const picked = available[Math.floor(Math.random() * available.length)];
        usedSet.add(JSON.stringify(picked));

        return this.formatQuestion(category, picked, level);
    }

    /* ----------------------------------
       FORMAT BASED ON CATEGORY
    ---------------------------------- */

    formatQuestion(category, q, level) {

        if (category === 'number-series') {
            const wrong = ['5', '7', '9', '11', '12', '15', '18', '22', '24', '26']
                .filter(x => x !== q.next)
                .slice(0, 3);

            return {
                category,
                difficulty: q.difficulty || null,
                level,
                questionText: `What is the next number in this series: ${q.num.join(', ')}, ?`,
                options: this.shuffle([q.next, ...wrong]),
                correctAnswer: q.next,
                explanation: q.desc
            };
        }

        if (category === 'patterns') {
            return {
                category,
                difficulty: q.difficulty || null,
                level,
                questionText: `What is the next element in the pattern: ${q.seq} ?`,
                options: this.shuffle(q.opts || ['A', 'B', 'C', 'D']),
                correctAnswer: q.next,
                explanation: q.desc
            };
        }

        // puzzles / aptitude / reasoning
        return {
            category,
            difficulty: q.difficulty || null,
            level,
            questionText: q.q,
            options: this.shuffle(q.opts),
            correctAnswer: q.a,
            explanation: q.desc || `Correct answer is ${q.a}`
        };
    }

    /* ----------------------------------
       HINT (STATIC)
    ---------------------------------- */

    async getHint() {
        return 'Focus on the pattern or logic used in the question.';
    }

    /* ----------------------------------
       EXPLANATION
    ---------------------------------- */

    async getExplanation(questionText, options, correctAnswer) {
        return `The correct answer is ${correctAnswer}.`;
    }

    /* ----------------------------------
       UTILS
    ---------------------------------- */

    shuffle(arr) {
        if (!arr) return [];
        return [...arr].sort(() => Math.random() - 0.5);
    }

}

module.exports = new AIQuestionService();
