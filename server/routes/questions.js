const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getQuestionsByCategory,
    getPracticeQuestions,
    generateQuestion,
    submitAnswer
} = require('../controllers/questionController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/questions/category/:category
 * @desc    Get questions by category
 * @access  Private
 */
router.get('/category/:category', protect, getQuestionsByCategory);

/**
 * @route   GET /api/questions/practice
 * @desc    Get random practice questions
 * @access  Private
 */
router.get('/practice', protect, getPracticeQuestions);

/**
 * @route   POST /api/questions/generate
 * @desc    Generate a new question from bank
 * @access  Private
 */
router.post('/generate', protect, generateQuestion);

/**
 * @route   POST /api/questions/submit
 * @desc    Submit practice answer
 * @access  Private
 */
router.post(
    '/submit',
    protect,
    [
        body('questionId')
            .notEmpty()
            .withMessage('Question ID is required'),
        body('answer')
            .notEmpty()
            .withMessage('Answer is required')
    ],
    validate,
    submitAnswer
);

module.exports = router;
