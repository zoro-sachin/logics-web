const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');
const questionController = require('./controllers/questionController');
// Mock request/response removed
require('dotenv').config();

const log = console.log;

async function verifyProgression() {
    try {
        log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/logical-thinking-db');

        // 1. Setup User and Question
        const userId = new mongoose.Types.ObjectId();
        const questionId = new mongoose.Types.ObjectId();

        log('Creating Test User and Question...');
        await User.deleteOne({ _id: userId });
        await Question.deleteOne({ _id: questionId });

        const user = await User.create({
            _id: userId,
            username: 'progression_test',
            email: 'progression@test.com',
            password: 'hashedpassword',
            currentLevel: 1,
            levelProgress: 4, // 1 away from level up
            questionsNeededForLevel: 5
        });

        const question = await Question.create({
            _id: questionId,
            category: 'reasoning',
            difficulty: 'easy',
            level: 1,
            questionText: 'TestQ',
            options: ['A', 'B'],
            correctAnswer: 'A',
            explanation: 'Exp',
            points: 10
        });

        // 2. Manual Mock Request/Response
        const req = {
            method: 'POST',
            url: '/api/questions/submit',
            body: {
                questionId: questionId.toString(),
                answer: 'A'
            },
            user: { _id: userId } // Auth middleware effect
        };

        // Simple mock response
        const res = {
            _jsonData: null,
            _statusCode: 200,
            json: function (data) {
                this._jsonData = data;
                return this;
            },
            status: function (code) {
                this._statusCode = code;
                return this;
            }
        };

        log('Submitting correct answer (should trigger level up)...');

        // Call controller
        await questionController.submitAnswer(req, res);

        const data = res._jsonData;
        log('Response:', JSON.stringify(data, null, 2));

        if (data && data.success && data.data.levelUp) {
            log('SUCCESS: Level Up detected in response.');
            log(`New Level: ${data.data.newLevel}`);

            // Verify DB
            const updatedUser = await User.findById(userId);
            log(`User DB Level: ${updatedUser.currentLevel}`);
            log(`User DB Progress: ${updatedUser.levelProgress}`);

            if (updatedUser.currentLevel === 2 && updatedUser.levelProgress === 0) {
                log('SUCCESS: User document updated correctly.');
            } else {
                log('FAILURE: User document not updated correctly.');
            }

        } else {
            log('FAILURE: Did not level up.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
        log('Disconnected.');
    }
}

verifyProgression();
