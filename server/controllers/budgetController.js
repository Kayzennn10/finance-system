const db = require('../config/db');  // Pastikan kamu mengatur koneksi db dengan benar

// Fungsi untuk menambah anggaran
const addBudget = (req, res) => {
  const { category, amount, month, year } = req.body;
  const userId = req.user.id;  // Ambil ID pengguna dari JWT

  // Periksa apakah data lengkap
  if (!category || !amount || !month || !year) {
    return res.status(400).send('Missing required fields');
  }

  // Query untuk menambah anggaran
  db.query(
    'INSERT INTO budgets (user_id, category, amount, month, year) VALUES (?, ?, ?, ?, ?)',
    [userId, category, amount, month, year],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error adding budget');
      }
      res.status(201).send('Budget added successfully');
    }
  );
};

module.exports = { addBudget };
