const mysql = require('mysql2');

// Membuat koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',  // Alamat database, biasanya 'localhost' untuk pengembangan lokal
  user: 'root',       // Sesuaikan dengan username MySQL Anda
  password: 'oop',       // Sesuaikan dengan password MySQL Anda
  database: 'finance_system'  // Sesuaikan dengan nama database yang digunakan
});

// Menghubungkan ke database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Database connected successfully!');
});

module.exports = db;
