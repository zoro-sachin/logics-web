const aiService = require('../services/aiQuestionService');

jest.mock('../models/Question');
const Question = require('../models/Question');
const questionBank = require('../services/questionBank');

describe('AIService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Reset the used tracker for tests
        aiService.used = {};
    });

    describe('getDifficultyForLevel', () => {
        it('should return easy for levels 1-5', () => {
            expect(aiService.getDifficultyForLevel(1)).toBe('easy');
            expect(aiService.getDifficultyForLevel(5)).toBe('easy');
        });

        it('should return medium for levels 6-10', () => {
            expect(aiService.getDifficultyForLevel(6)).toBe('medium');
            expect(aiService.getDifficultyForLevel(10)).toBe('medium');
        });

        it('should return hard for levels > 10', () => {
            expect(aiService.getDifficultyForLevel(11)).toBe('hard');
            expect(aiService.getDifficultyForLevel(20)).toBe('hard');
        });
    });

    describe('generateQuestionsForLevel', () => {
        it('should return questions from the local bank', async () => {
            const questions = await aiService.generateQuestionsForLevel('number-series', 1, 1);

            expect(questions).toHaveLength(1);
            expect(questions[0].category).toBe('number-series');
            expect(questions[0].level).toBe(1);
            expect(questions[0]).toHaveProperty('questionText');
            expect(questions[0]).toHaveProperty('options');
            expect(questions[0]).toHaveProperty('correctAnswer');
        });

        it('should track used questions to avoid immediate repetition', async () => {
            const count = questionBank.getByCategory('number-series', 'easy').length;

            // If we request all questions, one by one, they should eventually reset
            for (let i = 0; i < count; i++) {
                await aiService.generateQuestionsForLevel('number-series', 1, 1);
            }

            const usedSize = aiService._getUsedSet('number-series', 'easy').size;
            expect(usedSize).toBe(count);

            // The next one should trigger a reset
            await aiService.generateQuestionsForLevel('number-series', 1, 1);
            expect(aiService._getUsedSet('number-series', 'easy').size).toBe(1);
        });
    });

    describe('generateQuestion', () => {
        it('should provide single question interface', async () => {
            const q = await aiService.generateQuestion('puzzles', 'easy');
            expect(q.category).toBe('puzzles');
            expect(q).toHaveProperty('questionText');
        });
    });
});
