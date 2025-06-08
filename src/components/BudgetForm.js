import React, { useState } from 'react';
import axios from 'axios';
import './BudgetForm.css'; // Import CSS file

const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // Last 5 years
  const months = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!category || !amount || !month || !year) {
      setError('Semua kolom wajib diisi.');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setError('Jumlah harus lebih dari 0.');
      return;
    }

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Pengguna tidak masuk. Silakan masuk terlebih dahulu.');
        return;
      }

      await axios.post('http://localhost:5000/api/budgets', {
        user_id: userId,
        category,
        amount: parseFloat(amount),
        month: parseInt(month),
        year: parseInt(year),
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuccess('Anggaran berhasil ditambahkan!');
      // Clear form after successful submission
      setCategory('');
      setAmount('');
      setMonth(new Date().getMonth() + 1);
      setYear(new Date().getFullYear());
    } catch (err) {
      console.error('Error adding budget:', err.response ? err.response.data : err.message);
      setError(`Gagal menambahkan anggaran: ${err.response && err.response.data.msg ? err.response.data.msg : 'Silakan coba lagi.'}`);
    }
  };

  return (
    <div className="budget-form-container">
      <h1>Atur Anggaran Bulanan</h1>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label htmlFor="category">Kategori Anggaran:</label>
          <input 
            type="text" 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="Masukkan Kategori (e.g., Makanan, Transportasi)" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Jumlah Anggaran:</label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Masukkan Jumlah Anggaran"
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="month">Bulan:</label>
          <select id="month" value={month} onChange={(e) => setMonth(e.target.value)} required>
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="year">Tahun:</label>
          <select id="year" value={year} onChange={(e) => setYear(e.target.value)} required>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Simpan Anggaran</button>
        </div>
      </form>
    </div>
  );
};

export default BudgetForm;
