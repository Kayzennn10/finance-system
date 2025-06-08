import express from 'express';
const router = express.Router();
import { getFinancialReport } from '../controllers/reportController.js';
import auth from '../middleware/auth.js';

// Get monthly or yearly financial report for a user
router.get('/:type/:userId', auth, getFinancialReport);

export default router; 