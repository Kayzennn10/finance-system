const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { addBudget } = require('../controllers/budgetController');

// Route untuk menambah anggaran (dengan autentikasi JWT)
router.post('/', authenticateJWT, addBudget);

module.exports = router;
