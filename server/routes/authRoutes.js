const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Public Routes (No authentication required)
router.post('/signup', authController.signup); // User registration
router.post('/login', authController.login);   // User login

module.exports = router;
