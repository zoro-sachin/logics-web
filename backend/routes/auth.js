const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public login
router.post('/login', authController.login);

// Optional register route (protected in production)
router.post('/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  authController.register
);

// Example protected route to get current user
router.get('/me', authMiddleware, async (req, res) => {
  res.json({ id: req.user.id, email: req.user.email, role: req.user.role });
});

module.exports = router;
 