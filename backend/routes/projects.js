const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const projectController = require('../controllers/projectController');
const auth = require('../middleware/authMiddleware');

// Public
router.get('/', projectController.getAll);
router.get('/:id', projectController.getOne);

// Admin (protected)
router.post('/',
  auth,
  [
    body('title').notEmpty().withMessage('Title required')
  ],
  projectController.create
);

router.put('/:id', auth, projectController.update);
router.delete('/:id', auth, projectController.remove);

module.exports = router;
