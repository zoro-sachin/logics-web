const mongoose = require('mongoose');
const aiService = require('./services/aiService');
const Question = require('./models/Question');
require('dotenv').config();

// Mock console.log to see output cleanly
const log = console.log;

async function verifyFix() {
    try {
        log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/logical-thinking-db');
        log('Connected.');

        // 1. Clear Questions for Level 1 Reasoning to force generation
        log('Clearing Level 1 reasoning questions...');
        await Question.deleteMany({ category: 'reasoning', level: 1 });

        const countBefore = await Question.countDocuments({ category: 'reasoning', level: 1 });
        log(`Questions in DB: ${countBefore}`);

        // 2. Call Service directly (mimicking what controller does)
        log('Calling aiService.generateQuestionsForLevel(reasoning, 1, 5)...');
        // Mock OpenAI call if we don't want to spend credits, BUT we want to verify it works.
        // If we want to mock axios, we'd need to mock it. 
        // For this manual test, let's assuming we want to see if the LOGIC works.
        // The previous error was that logic wasn't there.

        // I'll assume valid API KEY is in .env. If not, this acts as a test for that too.
        try {
            const questions = await aiService.generateQuestionsForLevel('reasoning', 1, 3); // Gen 3
            log(`Service returned ${questions.length} questions.`);

            if (questions.length > 0) {
                log('First Question Text:', questions[0].questionText);
                log('First Question Level:', questions[0].level);
            }
        } catch (e) {
            log('Error calling AI service:', e.message);
        }

        // 3. Verify DB persistence
        const countAfter = await Question.countDocuments({ category: 'reasoning', level: 1 });
        log(`Questions in DB after: ${countAfter}`);

        if (countAfter > countBefore) {
            log('SUCCESS: Questions were generated and saved.');
        } else {
            log('FAILURE: No new questions saved.');
        }

    } catch (err) {
        console.error('Test Execution Error:', err);
    } finally {
        await mongoose.disconnect();
        log('Disconnected.');
    }
}

verifyFix();
