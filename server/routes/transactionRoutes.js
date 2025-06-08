import express from 'express';
const router = express.Router();
import { addTransaction, getTransactions } from '../controllers/transactionController.js';
import auth from '../middleware/auth.js';

// Route untuk menambah transaksi (dengan autentikasi JWT)
router.post('/api/transactions', auth, addTransaction);

// Get all transactions for a user
router.get('/api/transactions/:userId', auth, getTransactions);

export default router;
