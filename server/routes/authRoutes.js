import express from 'express';
const router = express.Router();
import { register, login, getUserData } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Dashboard (protected) route
router.get('/dashboard', auth, getUserData);

export default router;
