const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    checkEligibility,
    generateCertificate,
    getUserCertificates
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const { validate } = require('../middleware/validation');

/**
 * @route   GET /api/certificates/check/:scoreId
 * @desc    Check certificate eligibility
 * @access  Private
 */
router.get('/check/:scoreId', protect, checkEligibility);

/**
 * @route   POST /api/certificates/generate
 * @desc    Generate certificate PDF
 * @access  Private
 */
router.post(
    '/generate',
    protect,
    [
        body('scoreId')
            .notEmpty()
            .withMessage('Score ID is required')
    ],
    validate,
    generateCertificate
);

/**
 * @route   GET /api/certificates/user
 * @desc    Get user's certificates
 * @access  Private
 */
router.get('/user', protect, getUserCertificates);

module.exports = router;
