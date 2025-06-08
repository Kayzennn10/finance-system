import express from 'express';
const router = express.Router();
import { getGoals, addGoal, updateGoal, deleteGoal } from '../controllers/goalController.js';
import auth from '../middleware/auth.js';

// Get all goals for a user
router.get('/:userId', auth, getGoals);

// Add a new goal
router.post('/:userId', auth, addGoal);

// Update a goal
router.put('/:userId/:goalId', auth, updateGoal);

// Delete a goal
router.delete('/:userId/:goalId', auth, deleteGoal);

export default router; 