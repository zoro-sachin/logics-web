const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Question = require('../models/Question');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const DATA_PATH = path.join(__dirname, '../data/questions_v2.json');

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
        const allQuestions = [];

        ['easy', 'medium', 'hard'].forEach(diff => {
            if (!data[diff]) return;
            Object.keys(data[diff]).forEach(cat => {
                const pool = data[diff][cat];
                if (!Array.isArray(pool)) return;

                pool.forEach(q => {
                    let questionText = q.questionText;
                    if (!questionText && q.num) {
                        questionText = `What is the next number in this series: ${q.num.join(', ')}, ?`;
                    }
                    if (!questionText && q.seq) {
                        questionText = `What is the next element in the pattern: ${q.seq} ?`;
                    }

                    if (!questionText) return;

                    allQuestions.push({
                        category: cat,
                        difficulty: diff,
                        level: q.level || (diff === 'easy' ? 1 : (diff === 'medium' ? 6 : 11)),
                        questionText: questionText,
                        options: q.options || (q.opts ? q.opts : []),
                        correctAnswer: q.correctAnswer || q.next || q.a || q.ans,
                        explanation: q.explanation || q.desc || `The answer is ${q.correctAnswer || q.next || q.a || q.ans}`,
                        generatedBy: 'System'
                    });
                });
            });
        });
        console.log(`Total questions to seed: ${allQuestions.length}`);

        // Option A: Clear and re-seed
        await Question.deleteMany({ generatedBy: 'System' });
        console.log('Cleared existing system questions.');

        // Insert in batches of 500 to avoid memory issues
        const batchSize = 500;
        for (let i = 0; i < allQuestions.length; i += batchSize) {
            const batch = allQuestions.slice(i, i + batchSize);
            await Question.insertMany(batch);
            console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
