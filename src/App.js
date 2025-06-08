import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import GoalsPage from './pages/GoalsPage';
import TransactionPage from './pages/TransactionPage';
import BudgetPage from './pages/BudgetPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/add-transaction" element={<TransactionPage />} />
        <Route path="/manage-budget" element={<BudgetPage />} />
      </Routes>
    </Router>
  );
}

export default App;
