import express from 'express';
const router = express.Router();
import { getFinancialReport, getFinancialSummary, getMonthlyData } from '../controllers/reportController.js';
import auth from '../middleware/auth.js';

// Get monthly or yearly financial report for a user
router.get('/:type/:userId', auth, getFinancialReport);

// Get financial summary for dashboard
router.get('/financial-summary/:userId', auth, getFinancialSummary);

// Get monthly data for dashboard charts
router.get('/monthly-data/:userId', auth, getMonthlyData);

export default router; 