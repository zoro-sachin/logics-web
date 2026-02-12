const fs = require('fs');
const path = require('path');
const questionBank = require('./questionBank');

class QuestionService {
    constructor() {
        this.used = {};
        this.v2Data = null;
        this._loadV2Data();
    }

    _loadV2Data() {
        try {
            const v2Path = path.join(__dirname, '../data/questions_v2.json');
            if (fs.existsSync(v2Path)) {
                this.v2Data = JSON.parse(fs.readFileSync(v2Path, 'utf8'));
                console.log('Loaded v2 Question Data successfully');
            }
        } catch (error) {
            console.error('Failed to load v2 data:', error);
        }
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

    getDifficultyForLevel(level) {
        if (level <= 5) return 'easy';
        if (level <= 10) return 'medium';
        return 'hard';
    }

    async generateQuestion(category, difficulty, level = 1) {
        // Try v2 data first
        if (this.v2Data) {
            const pool = this.v2Data[difficulty]?.[category];
            if (pool && pool.length > 0) {
                return this.getQuestionFromPool(pool, category, difficulty, level);
            }
        }
        return this.getQuestionFromBank(category, difficulty, level);
    }

    getQuestionFromPool(pool, category, difficulty, level = 1) {
        const usedSet = this._getUsedSet(category, difficulty);
        if (usedSet.size >= pool.length) usedSet.clear();

        const available = pool.filter(q => !usedSet.has(JSON.stringify(q)));
        let picked = available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : pool[Math.floor(Math.random() * pool.length)];

        usedSet.add(JSON.stringify(picked));
        return this.formatQuestion(category, picked, level, difficulty);
    }

    getQuestionFromBank(category, difficulty, level = 1) {
        const pool = questionBank.getByCategory(category, difficulty);
        if (!pool || pool.length === 0) return null;

        return this.getQuestionFromPool(pool, category, difficulty, level);
    }

    formatQuestion(category, q, level, difficulty) {
        // Handle v1 format (with .num) or v2 format (with .questionText)
        if (q.questionText) {
            return {
                ...q,
                level,
                difficulty: q.difficulty || difficulty || 'easy',
                options: this.shuffle(q.options)
            };
        }

        if (category === 'number-series') {
            const wrong = ['5', '7', '9', '11', '12', '15', '18', '22', '24', '26']
                .filter(x => x !== q.next)
                .slice(0, 3);
            while (wrong.length < 3) wrong.push(Math.floor(Math.random() * 100).toString());

            return {
                category,
                difficulty: q.difficulty || difficulty || 'easy',
                level,
                questionText: `What is the next number in this series: ${q.num.join(', ')}, ?`,
                options: this.shuffle([q.next, ...wrong]),
                correctAnswer: q.next,
                explanation: q.desc || 'Find the next number in the arithmetic or geometric progression.'
            };
        }

        if (category === 'patterns') {
            const nextVal = q.next || (q.seq ? q.seq[0] : 'A');
            let opts = q.opts || q.options;

            if (!opts || opts.length < 2) {
                // Generate distractors based on the sequence characters
                const chars = Array.from(new Set((q.seq || '').split(''))).filter(c => c !== nextVal);
                const common = ['A', 'B', 'C', 'X', 'Y', 'Z', '1', '2', '3'].filter(c => c !== nextVal);
                const wrong = Array.from(new Set([...chars, ...common])).slice(0, 3);
                while (wrong.length < 3) wrong.push(String.fromCharCode(65 + Math.floor(Math.random() * 26)));
                opts = [nextVal, ...wrong];
            }

            return {
                category,
                difficulty: q.difficulty || difficulty || 'easy',
                level,
                questionText: q.questionText || (q.seq ? `What comes next in this pattern: ${q.seq}, ?` : q.q),
                options: this.shuffle(opts),
                correctAnswer: nextVal,
                explanation: q.desc || q.explanation || `The pattern follows a repeating sequence.`
            };
        }

        // Default formatting for Reasoning, Aptitude, Puzzles
        const correctAnswer = q.a || q.next || q.correctAnswer;
        let options = q.opts || q.options;

        if (!options || options.length < 2) {
            // Very basic distractor generation if missing
            const distractors = ['Depends', 'None', 'All of them', 'Not enough info']
                .filter(d => d.toLowerCase() !== String(correctAnswer).toLowerCase())
                .slice(0, 3);
            options = [correctAnswer, ...distractors];
        }

        // Ensure we have a valid correct answer
        if (!correctAnswer && options && options.length > 0) {
            console.warn(`Missing correct answer for question: ${q.questionText || q.q}. Defaulting to first option.`);
            correctAnswer = options[0];
        }

        return {
            category,
            difficulty: q.difficulty || difficulty || 'easy',
            level,
            questionText: q.q || q.seq || q.questionText || 'Question text missing',
            options: this.shuffle(options),
            correctAnswer: String(correctAnswer), // Ensure string
            explanation: q.desc || q.explanation || `The correct answer is ${correctAnswer}.`
        };
    }

    shuffle(arr) {
        if (!arr) return [];
        return [...arr].sort(() => Math.random() - 0.5);
    }
}

module.exports = new QuestionService();
