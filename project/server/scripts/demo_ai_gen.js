const mongoose = require('mongoose');
const aiQuestionService = require('../services/aiQuestionService');
const Question = require('../models/Question');
require('dotenv').config();

async function demoAutoGeneration() {
    try {
        console.log('--- AI Auto-Generation Demo ---');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/logical-thinking-db');
        console.log('Connected to MongoDB.');

        const testLevel = 99; // Using a high level unlikely to have questions
        const testCategory = 'puzzles';

        console.log(`\n1. Checking for existing questions for Level ${testLevel}...`);
        const count = await Question.countDocuments({ level: testLevel });
        console.log(`Found ${count} questions.`);

        if (count === 0) {
            console.log(`\n2. Triggering automatic batch generation for Level ${testLevel}...`);
            // This mimics what happens in the controller
            const questions = await aiQuestionService.generateQuestionsForLevel(testCategory, testLevel, 3);
            console.log(`Successfully generated ${questions.length} new questions!`);

            questions.forEach((q, i) => {
                console.log(`\nQuestion ${i + 1}: ${q.questionText}`);
                console.log(`Options: ${q.options.join(', ')}`);
                console.log(`Answer: ${q.correctAnswer}`);
            });
        } else {
            console.log('\nQuestions already exist for this test level. Try a different level or clear them.');
        }

        // Cleanup the test data
        console.log(`\n3. Cleaning up test data for Level ${testLevel}...`);
        await Question.deleteMany({ level: testLevel });
        console.log('Cleanup complete.');

    } catch (err) {
        console.error('Demo Error:', err.message);
    } finally {
        await mongoose.disconnect();
        console.log('\nDemo Finished.');
    }
}

demoAutoGeneration();
