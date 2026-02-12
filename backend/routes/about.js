const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const auth = require('../middleware/authMiddleware');

// public
router.get('/', aboutController.getAbout);

// admin
router.put('/', auth, aboutController.upsertAbout);

module.exports = router;
