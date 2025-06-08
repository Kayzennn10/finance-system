const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/authMiddleware');
const { addTransaction } = require('../controllers/transactionController');

// Route untuk menambah transaksi (dengan autentikasi JWT)
router.post('/', authenticateJWT, addTransaction);

module.exports = router;
