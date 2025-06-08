import db from '../config/db.js';

// Fungsi untuk menambah transaksi
export const addTransaction = async (req, res) => {
  const { user_id, type, amount, category, description, transaction_date } = req.body;

  if (!user_id || !type || !amount || !category || !description || !transaction_date) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, category, description, transaction_date) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, type, amount, category, description, transaction_date]
    );
    res.status(201).json({ message: 'Transaction added successfully', transactionId: result.insertId });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ message: 'Error adding transaction', error: error.message });
  }
};

export const getTransactions = async (req, res) => {
  const { userId } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ?', [userId]);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
