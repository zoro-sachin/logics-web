/**
 * Question Service
 * =================================
 * ✔ Serves questions from static questionBank
 * ✔ Manages used questions for variety
 * ✔ Categorization and level-based difficulty
 */

const questionBank = require('./questionBank');

class QuestionService {
    constructor() {
        this.used = {};
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
       MAIN ENTRY
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
       STATIC BANK LOGIC
    ---------------------------------- */

    getQuestionFromBank(category, difficulty, level = 1) {
        const pool = questionBank.getByCategory(category, difficulty);

        if (!pool || pool.length === 0) {
            console.warn(`No questions in bank for ${category} - ${difficulty}`);
            return null;
        }

        const usedSet = this._getUsedSet(category, difficulty);

        if (usedSet.size >= pool.length) {
            usedSet.clear();
        }

        const available = pool.filter(q => {
            const key = JSON.stringify(q);
            return !usedSet.has(key);
        });

        let picked;
        if (available.length === 0) {
            usedSet.clear();
            picked = pool[Math.floor(Math.random() * pool.length)];
        } else {
            picked = available[Math.floor(Math.random() * available.length)];
        }

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

            while (wrong.length < 3) wrong.push(Math.floor(Math.random() * 100).toString());

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

        if (category === 'boolean-logic') {
            return {
                category,
                difficulty: q.difficulty || null,
                level,
                questionText: `Logic Evaluation: ${q.q}`,
                options: this.shuffle(q.opts),
                correctAnswer: q.a,
                explanation: q.desc || `The logical expression evaluates to ${q.a}.`
            };
        }

        if (category === 'algorithmic-logic') {
            return {
                category,
                difficulty: q.difficulty || null,
                level,
                questionText: `Trace the Logic: ${q.q}`,
                options: this.shuffle(q.opts),
                correctAnswer: q.a,
                explanation: q.desc || `Following the steps sequentially results in ${q.a}.`
            };
        }

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
       UTILS
    ---------------------------------- */

    shuffle(arr) {
        if (!arr) return [];
        return [...arr].sort(() => Math.random() - 0.5);
    }
}

module.exports = new QuestionService();
