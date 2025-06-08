import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GoalsPage.css'; // Make sure to create this CSS file

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({
    goal_name: '',
    target_amount: '',
    current_savings: '',
    target_date: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(null); // Stores the ID of the goal being edited

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        setError('No token or user ID found. Please login.');
        setLoading(false);
        return;
      }
      const response = await axios.get(`http://localhost:5000/api/goals/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data);
    } catch (err) {
      setError('Failed to fetch goals.');
      console.error('Error fetching goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal({ ...newGoal, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) return;

      if (isEditing) {
        await axios.put(`http://localhost:5000/api/goals/${userId}/${isEditing}`, newGoal, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Tujuan berhasil diperbarui!');
        setIsEditing(null);
      } else {
        await axios.post(`http://localhost:5000/api/goals/${userId}`, newGoal, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Tujuan berhasil ditambahkan!');
      }
      setNewGoal({ goal_name: '', target_amount: '', current_savings: '', target_date: '' });
      fetchGoals();
    } catch (err) {
      setError('Gagal menambahkan/memperbarui tujuan.');
      console.error('Error saving goal:', err);
    }
  };

  const handleEdit = (goal) => {
    setNewGoal({
      goal_name: goal.goal_name,
      target_amount: goal.target_amount,
      current_savings: goal.current_savings,
      target_date: goal.target_date.split('T')[0], // Format date for input
    });
    setIsEditing(goal.id);
  };

  const handleDelete = async (goalId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tujuan ini?')) {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if (!token || !userId) return;
        await axios.delete(`http://localhost:5000/api/goals/${userId}/${goalId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Tujuan berhasil dihapus!');
        fetchGoals();
      } catch (err) {
        setError('Gagal menghapus tujuan.');
        console.error('Error deleting goal:', err);
      }
    }
  };

  const calculateMonthlyAllocation = (targetAmount, currentSavings, targetDate) => {
    const today = new Date();
    const target = new Date(targetDate);
    const monthsRemaining = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());

    const remainingAmount = targetAmount - currentSavings;
    if (remainingAmount <= 0) return 0;
    if (monthsRemaining <= 0) return remainingAmount; // If target date is in the past or current month
    
    return (remainingAmount / monthsRemaining).toFixed(2);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return <div className="goals-loading">Memuat tujuan...</div>;
  }

  if (error) {
    return <div className="goals-error">Error: {error}</div>;
  }

  return (
    <div className="goals-container">
      <h1>Rencana Tabungan & Investasi</h1>

      <div className="goal-form-section">
        <h2>{isEditing ? 'Edit Tujuan' : 'Tambah Tujuan Baru'}</h2>
        <form onSubmit={handleSubmit} className="goal-form">
          <input
            type="text"
            name="goal_name"
            value={newGoal.goal_name}
            onChange={handleChange}
            placeholder="Nama Tujuan (e.g., Beli Rumah)"
            required
          />
          <input
            type="number"
            name="target_amount"
            value={newGoal.target_amount}
            onChange={handleChange}
            placeholder="Target Jumlah (Rp)"
            required
          />
          <input
            type="number"
            name="current_savings"
            value={newGoal.current_savings}
            onChange={handleChange}
            placeholder="Tabungan Saat Ini (Rp)"
            required
          />
          <input
            type="date"
            name="target_date"
            value={newGoal.target_date}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-primary">
            {isEditing ? 'Perbarui Tujuan' : 'Tambah Tujuan'}
          </button>
          {isEditing && (
            <button type="button" className="btn-secondary" onClick={() => {
              setIsEditing(null);
              setNewGoal({ goal_name: '', target_amount: '', current_savings: '', target_date: '' });
            }}>
              Batal Edit
            </button>
          )}
        </form>
      </div>

      <div className="goals-list-section">
        <h2>Daftar Tujuan</h2>
        {goals.length === 0 ? (
          <p className="no-goals">Belum ada tujuan yang ditambahkan.</p>
        ) : (
          <div className="goals-grid">
            {goals.map((goal) => (
              <div key={goal.id} className="goal-card">
                <h3>{goal.goal_name}</h3>
                <p>Target: <strong>{formatCurrency(goal.target_amount)}</strong></p>
                <p>Terkumpul: <strong className={goal.current_savings >= goal.target_amount ? 'positive' : 'negative'}>
                  {formatCurrency(goal.current_savings)}
                </strong></p>
                <p>Tanggal Target: {new Date(goal.target_date).toLocaleDateString('id-ID')}</p>
                <p>Alokasi Bulanan Dibutuhkan: <strong>
                  {formatCurrency(calculateMonthlyAllocation(goal.target_amount, goal.current_savings, goal.target_date))}
                </strong></p>
                <div className="goal-actions">
                  <button className="btn-edit" onClick={() => handleEdit(goal)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(goal.id)}>Hapus</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalsPage; 