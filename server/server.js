import cors from 'cors';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import * as authController from './controllers/authController.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes - Gunakan authRoutes sebagai middleware
app.use('/api/auth', authRoutes);

// Transaction Routes
app.use('/api/transactions', transactionRoutes);

// Budget Routes
app.use('/api/budgets', budgetRoutes);

// Report Routes
app.use('/api/reports', reportRoutes);
app.use('/api/goals', goalRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`=================================`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`=================================`);
  console.log('Available routes:');
  console.log('- GET  /api/health');
  console.log('- POST /api/auth/register'); // Ini akan ditangani oleh authRoutes
  console.log('- POST /api/auth/login');    // Ini akan ditangani oleh authRoutes
  console.log('- GET  /api/auth/dashboard'); // Ini akan ditangani oleh authRoutes dengan auth middleware
  console.log('- GET  /api/transactions');
  console.log('- GET  /api/budgets');
  console.log('- GET  /api/reports');
  console.log('- GET  /api/goals');
  console.log(`=================================`);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});