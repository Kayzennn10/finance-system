const db = require('../config/db');  // Pastikan kamu mengatur koneksi db dengan benar

// Fungsi untuk menambah transaksi
const addTransaction = (req, res) => {
  const { type, amount, category, description } = req.body;
  const userId = req.user.id;  // Ambil ID pengguna dari JWT

  // Periksa apakah data lengkap
  if (!type || !amount || !category) {
    return res.status(400).send('Missing required fields');
  }

  // Query untuk menambah transaksi
  db.query(
    'INSERT INTO transactions (user_id, type, amount, category, description) VALUES (?, ?, ?, ?, ?)',
    [userId, type, amount, category, description],
    (err, result) => {
      if (err) {
        return res.status(500).send('Error adding transaction');
      }
      res.status(201).send('Transaction added successfully');
    }
  );
};

module.exports = { addTransaction };
