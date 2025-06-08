import React from 'react';
import TransactionForm from '../components/TransactionForm';

const TransactionPage = () => {
  return (
    <div className="transaction-page-container">
      <h1>Tambah Transaksi Baru</h1>
      <TransactionForm />
    </div>
  );
};

export default TransactionPage; 