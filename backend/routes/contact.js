 const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const contactController = require('../controllers/contactController');
const auth = require('../middleware/authMiddleware');

// public - send message
router.post('/',
  [
    body('name').notEmpty(),
    body('email').isEmail(),
    body('message').notEmpty()
  ],
  contactController.sendMessage
);

// admin - view messages
router.get('/', auth, contactController.listMessages);
router.put('/:id/seen', auth, contactController.markSeen);

module.exports = router;
