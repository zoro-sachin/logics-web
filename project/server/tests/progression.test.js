// MongoMemoryServer removed for stability
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const questionController = require('../controllers/questionController');
const User = require('../models/User');
const Question = require('../models/Question');

// Mock specific routes
const app = express();
app.use(express.json());

// Mock Auth Middleware
app.use(async (req, res, next) => {
    // Fetch the only user in DB for simplification, or create one if needed
    // In test we seed one user.
    const user = await User.findOne();
    req.user = user || { _id: new mongoose.Types.ObjectId(), currentLevel: 1 };
    next();
});

app.post('/api/questions/submit', submitAnswerWrapper);
app.get('/api/questions/practice', getPracticeWrapper);

// Wrappers to inject req.user into the controller (since we mock auth middleware)
async function submitAnswerWrapper(req, res) {
    req.user = await User.findOne();
    return questionController.submitAnswer(req, res);
}

async function getPracticeWrapper(req, res) {
    req.user = await User.findOne();
    return questionController.getPracticeQuestions(req, res);
}

beforeAll(async () => {
    // Use local test DB
    const mongoUri = process.env.MONGO_URI_TEST || 'mongodb://127.0.0.1:27017/logical-thinking-test-db';
    await mongoose.connect(mongoUri);
});

afterAll(async () => {
    // Cleanup
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
    }
});

describe.skip('Progression Logic', () => {
    let user;
    let question;

    beforeEach(async () => {
        await User.deleteMany({});
        await Question.deleteMany({});

        const userId = new mongoose.Types.ObjectId();

        // Seed User
        user = await User.create({
            _id: userId,
            username: 'testuser',
            email: 'test@test.com',
            password: 'password',
            currentLevel: 1,
            levelProgress: 4, // 1 away from level up (default 5 needed)
            questionsNeededForLevel: 5
        });

        // Seed Question
        question = await Question.create({
            category: 'reasoning',
            difficulty: 'easy',
            level: 1,
            questionText: 'Q1',
            options: ['A', 'B'],
            correctAnswer: 'A',
            explanation: 'Exp',
            points: 10
        });
    });

    it('should submit answer and increment progress', async () => {
        // Update user to have 0 progress
        user.levelProgress = 0;
        await user.save();

        const res = await request(app)
            .post('/api/questions/submit')
            .send({ questionId: question._id, answer: 'A' });

        expect(res.body.success).toBe(true);
        expect(res.body.data.isCorrect).toBe(true);

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.levelProgress).toBe(1);
        expect(updatedUser.currentLevel).toBe(1);
    });

    it('should level up when threshold reached', async () => {
        // User starts with progress 4/5
        const res = await request(app)
            .post('/api/questions/submit')
            .send({ questionId: question._id, answer: 'A' });

        expect(res.body.success).toBe(true);
        expect(res.body.data.levelUp).toBe(true);
        expect(res.body.data.newLevel).toBe(2);

        const updatedUser = await User.findById('userid123');
        expect(updatedUser.currentLevel).toBe(2);
        expect(updatedUser.levelProgress).toBe(0);
    });
});
