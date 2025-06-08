import React, { useState } from 'react';
import axios from 'axios';
import './TransactionForm.css'; // Import CSS file

const TransactionForm = () => {
  const [type, setType] = useState('income');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today's date

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId'); // Get userId from localStorage
      if (!userId) {
        alert('User not logged in. Please login first.');
        return;
      }
      await axios.post('http://localhost:5000/api/transactions', {
        user_id: userId, // Include user_id
        type,
        amount: parseFloat(amount), // Ensure amount is a number
        category,
        description,
        transaction_date: transactionDate // Include transaction_date
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Transaction added successfully!');
      // Clear form after successful submission
      setAmount('');
      setCategory('');
      setDescription('');
      setTransactionDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      console.error('Error adding transaction:', err.response ? err.response.data : err.message);
      alert(`Error adding transaction: ${err.response && err.response.data.msg ? err.response.data.msg : 'Please try again.'}`);
    }
  };

  return (
    <div className="transaction-form-container">
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="type">Tipe Transaksi:</label>
          <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="income">Pendapatan</option>
            <option value="expense">Pengeluaran</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Jumlah:</label>
          <input 
            type="number" 
            id="amount" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)} 
            placeholder="Masukkan Jumlah" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Kategori:</label>
          <input 
            type="text" 
            id="category" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            placeholder="Masukkan Kategori (e.g., Gaji, Makanan)" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Deskripsi:</label>
          <textarea 
            id="description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Deskripsi Transaksi (opsional)"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="transactionDate">Tanggal Transaksi:</label>
          <input 
            type="date" 
            id="transactionDate" 
            value={transactionDate} 
            onChange={(e) => setTransactionDate(e.target.value)} 
            required 
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="submit-btn">Tambah Transaksi</button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;
