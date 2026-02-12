const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getQuizzes,
    getQuizById,
    submitQuiz,
    getQuizResults,
    submitDynamicQuiz
} = require('../controllers/quizController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/quizzes
 * @desc    Get all available quizzes
 * @access  Private
 */
router.get('/', protect, getQuizzes);

/**
 * @route   GET /api/quizzes/:id
 * @desc    Get quiz by ID
 * @access  Private
 */
router.get('/:id', protect, getQuizById);

/**
 * @route   POST /api/quizzes/:id/submit
 * @desc    Submit quiz answers
 * @access  Private
 */
router.post(
    '/:id/submit',
    protect,
    [
        body('answers')
            .isArray({ min: 1 })
            .withMessage('Answers must be an array with at least one answer'),
        body('timeSpent')
            .isInt({ min: 0 })
            .withMessage('Time spent must be a positive number')
    ],
    validate,
    submitQuiz
);

/**
 * @route   POST /api/quizzes/submit-dynamic
 * @desc    Submit dynamic quiz answers
 * @access  Private
 */
router.post('/submit-dynamic', protect, submitDynamicQuiz);

/**
 * @route   GET /api/quizzes/results/:scoreId
 * @desc    Get quiz results
 * @access  Private
 */
router.get('/results/:scoreId', protect, getQuizResults);

module.exports = router;
