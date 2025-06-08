import React, { useState } from 'react';
import axios from 'axios';

const BudgetForm = () => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/budgets', {
        category,
        amount,
        month,
        year
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Budget added');
    } catch (err) {
      alert('Error adding budget');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Category" />
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
      <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="Month" />
      <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
      <button type="submit">Add Budget</button>
    </form>
  );
};

export default BudgetForm;
