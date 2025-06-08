import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/transactions', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setTransactions(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <h3>Transactions:</h3>
      <ul>
        {transactions.map((transaction, index) => (
          <li key={index}>
            {transaction.type} - {transaction.amount} ({transaction.category})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
