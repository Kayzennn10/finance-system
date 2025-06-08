import express from 'express';
const router = express.Router();
import { addBudget, getBudgets } from '../controllers/budgetController.js';
import auth from '../middleware/auth.js';

// Route untuk menambah anggaran (dengan autentikasi JWT)
router.post('/api/budgets', auth, addBudget);

// Get all budgets for a user
router.get('/api/budgets/:userId', auth, getBudgets);

export default router;
