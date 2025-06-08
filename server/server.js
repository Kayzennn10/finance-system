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

// Auth Routes
app.post('/api/auth/register', (req, res) => {
  console.log('Register endpoint hit with data:', req.body);
  authController.register(req, res);
});

app.post('/api/auth/login', (req, res) => {
  console.log('Login endpoint hit with data:', req.body);
  authController.login(req, res);
});

app.get('/api/auth/dashboard', (req, res) => {
  console.log('Dashboard endpoint hit');
  authController.getUserData(req, res);
});

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
  console.log('- POST /api/auth/register');
  console.log('- POST /api/auth/login');
  console.log('- GET  /api/auth/dashboard');
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