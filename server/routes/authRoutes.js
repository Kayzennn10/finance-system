const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route untuk register
router.post('/register', authController.register);

// Route untuk login
router.post('/login', authController.login);

// Route untuk dashboard
router.get('/dashboard', authController.getUserData);

module.exports = router;
