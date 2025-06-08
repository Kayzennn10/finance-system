import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ReportPage from './pages/ReportPage';
import GoalsPage from './pages/GoalsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/reports" element={<ReportPage />} />
        <Route path="/goals" element={<GoalsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
