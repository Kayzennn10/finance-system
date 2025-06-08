import db from '../config/db.js';

// Get all goals for a user
export const getGoals = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM goals WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new goal
export const addGoal = async (req, res) => {
  const { userId } = req.params;
  const { goal_name, target_amount, current_savings, target_date } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO goals (user_id, goal_name, target_amount, current_savings, target_date) VALUES (?, ?, ?, ?, ?)',
      [userId, goal_name, target_amount, current_savings, target_date]
    );
    res.json({ msg: 'Goal added successfully', goalId: result.insertId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  const { userId, goalId } = req.params;
  const { goal_name, target_amount, current_savings, target_date } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE goals SET goal_name = ?, target_amount = ?, current_savings = ?, target_date = ? WHERE id = ? AND user_id = ?',
      [goal_name, target_amount, current_savings, target_date, goalId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Goal not found or not authorized' });
    }
    res.json({ msg: 'Goal updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  const { userId, goalId } = req.params;

  try {
    const [result] = await db.query('DELETE FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Goal not found or not authorized' });
    }
    res.json({ msg: 'Goal deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}; 