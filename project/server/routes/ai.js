const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { generateQuestion, getHint, getExplanation } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   POST /api/ai/generate-question
 * @desc    Generate a question using AI
 * @access  Private
 */
router.post(
    '/generate-question',
    protect,
    [
        body('category')
            .isIn(['number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning'])
            .withMessage('Invalid category'),
        body('difficulty')
            .isIn(['easy', 'medium', 'hard'])
            .withMessage('Invalid difficulty')
    ],
    validate,
    generateQuestion
);

/**
 * @route   POST /api/ai/hint
 * @desc    Get AI hint for a question
 * @access  Private
 */
router.post(
    '/hint',
    protect,
    [
        body('questionId')
            .notEmpty()
            .withMessage('Question ID is required')
    ],
    validate,
    getHint
);

/**
 * @route   POST /api/ai/explain
 * @desc    Get AI explanation for a question
 * @access  Private
 */
router.post(
    '/explain',
    protect,
    [
        body('questionId')
            .notEmpty()
            .withMessage('Question ID is required')
    ],
    validate,
    getExplanation
);

module.exports = router;
