const mongoose = require('mongoose');
require('dotenv').config();
const Question = require('./models/Question');
const questionService = require('./services/questionService');

async function repro() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected.");

        const category = 'number-series';
        const difficulty = 'easy';
        const level = 1;

        console.log(`Generating question for ${category}/${difficulty}...`);
        const questionData = await questionService.generateQuestion(category, difficulty, level);

        console.log("Generated Data:", JSON.stringify(questionData, null, 2));

        if (!questionData) {
            console.log("No data returned from service.");
            return;
        }

        console.log("Attempting to save to DB...");
        const question = await Question.create({
            ...questionData,
            generatedBy: 'System'
        });

        console.log("Successfully saved:", question._id);
    } catch (error) {
        console.error("REPRO FAILED:");
        console.error(error);
        if (error.errors) {
            console.error("Validation Errors:", JSON.stringify(error.errors, null, 2));
        }
    } finally {
        await mongoose.disconnect();
    }
}

repro();
