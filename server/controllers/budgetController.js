import db from '../config/db.js';

// Fungsi untuk menambah anggaran
export const addBudget = async (req, res) => {
  const { user_id, category, amount, month, year } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO budgets (user_id, category, amount, month, year) VALUES (?, ?, ?, ?, ?)',
      [user_id, category, amount, month, year]
    );
    res.status(201).json({ message: 'Budget added successfully', budgetId: result.insertId });
  } catch (error) {
    console.error('Error adding budget:', error);
    res.status(500).json({ message: 'Error adding budget', error: error.message });
  }
};

export const getBudgets = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM budgets WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
