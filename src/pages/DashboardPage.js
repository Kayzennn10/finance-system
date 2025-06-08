import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DashboardPage.css';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Title, 
  Tooltip, 
  Legend
);

const DashboardPage = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [financialSummary, setFinancialSummary] = useState({
    income: 0,
    expenses: 0,
    balance: 0,
    budgetStatus: 'On Track',
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:5000/api/auth/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        setUserData(response.data);
        fetchFinancialSummary(response.data.id);
        fetchMonthlyData(response.data.id);
      })
      .catch(err => {
        setError('Failed to fetch user data.');
        console.error(err);
      });
    } else {
      setError('No token found. Please login.');
    }

    // Set current month
    const now = new Date();
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    setCurrentMonth(`${monthNames[now.getMonth()]} ${now.getFullYear()}`);
  }, []);

  // Function to fetch financial summary
  const fetchFinancialSummary = (userId) => {
    axios.get(`http://localhost:5000/api/financial-summary/${userId}`)
      .then(response => {
        setFinancialSummary(response.data);
      })
      .catch(err => {
        console.error('Error fetching financial summary:', err);
      });
  };

  // Function to fetch monthly data for trends
  const fetchMonthlyData = (userId) => {
    axios.get(`http://localhost:5000/api/monthly-data/${userId}`)
      .then(response => {
        setMonthlyData(response.data);
      })
      .catch(err => {
        console.error('Error fetching monthly data:', err);
        // Set dummy data if API fails
        setMonthlyData([
          { month: 'Jan', income: 5000000, expenses: 3500000 },
          { month: 'Feb', income: 5500000, expenses: 4000000 },
          { month: 'Mar', income: 6000000, expenses: 4200000 },
          { month: 'Apr', income: 5800000, expenses: 3800000 },
          { month: 'Mei', income: 6200000, expenses: 4100000 },
          { month: 'Jun', income: 6500000, expenses: 4300000 },
        ]);
      });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Get budget status color
  const getBudgetStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'on track': return '#4CAF50';
      case 'warning': return '#FF9800';
      case 'over budget': return '#F44336';
      default: return '#2196F3';
    }
  };

  if (error) {
    return (
      <div className="dashboard-error">
        <h2>{error}</h2>
      </div>
    );
  }

  // Data for Income vs Expenses comparison chart
  const comparisonChartData = {
    labels: ['Pendapatan', 'Pengeluaran'],
    datasets: [
      {
        data: [financialSummary.income, financialSummary.expenses],
        backgroundColor: ['#4CAF50', '#F44336'],
        borderColor: ['#388E3C', '#D32F2F'],
        borderWidth: 2,
      },
    ],
  };

  // Data for monthly trend chart
  const trendChartData = {
    labels: monthlyData.map(item => item.month),
    datasets: [
      {
        label: 'Pendapatan',
        data: monthlyData.map(item => item.income),
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Pengeluaran',
        data: monthlyData.map(item => item.expenses),
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return 'Rp ' + value.toLocaleString('id-ID');
          }
        }
      }
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return context.label + ': ' + formatCurrency(context.raw);
          }
        }
      }
    },
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Keuangan</h1>
        <p className="current-period">Periode: {currentMonth}</p>
      </div>

      {userData ? (
        <div className="dashboard-content">
          {/* Financial Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card income-card">
              <div className="card-icon">💰</div>
              <div className="card-content">
                <h3>Total Pendapatan</h3>
                <p className="amount">{formatCurrency(financialSummary.income)}</p>
                <span className="card-label">Bulan ini</span>
              </div>
            </div>

            <div className="summary-card expense-card">
              <div className="card-icon">💸</div>
              <div className="card-content">
                <h3>Total Pengeluaran</h3>
                <p className="amount">{formatCurrency(financialSummary.expenses)}</p>
                <span className="card-label">Bulan ini</span>
              </div>
            </div>

            <div className="summary-card balance-card">
              <div className="card-icon">💳</div>
              <div className="card-content">
                <h3>Sisa Saldo</h3>
                <p className="amount">{formatCurrency(financialSummary.balance)}</p>
                <span className="card-label">Tersedia</span>
              </div>
            </div>

            <div className="summary-card budget-card">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <h3>Status Anggaran</h3>
                <p className="status" style={{ color: getBudgetStatusColor(financialSummary.budgetStatus) }}>
                  {financialSummary.budgetStatus}
                </p>
                <span className="card-label">Evaluasi bulanan</span>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-row">
              <div className="chart-container half-width">
                <h3>Perbandingan Pendapatan vs Pengeluaran</h3>
                <Doughnut data={comparisonChartData} options={doughnutOptions} />
              </div>

              <div className="chart-container half-width">
                <h3>Tren Keuangan 6 Bulan Terakhir</h3>
                <Line data={trendChartData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Monthly Financial Summary */}
          <div className="monthly-summary">
            <h3>Ringkasan Keuangan Bulanan</h3>
            <div className="summary-details">
              <div className="summary-row">
                <span>Pendapatan Bulan Ini:</span>
                <span className="positive">{formatCurrency(financialSummary.income)}</span>
              </div>
              <div className="summary-row">
                <span>Pengeluaran Bulan Ini:</span>
                <span className="negative">{formatCurrency(financialSummary.expenses)}</span>
              </div>
              <div className="summary-row">
                <span>Selisih:</span>
                <span className={financialSummary.balance >= 0 ? 'positive' : 'negative'}>
                  {formatCurrency(financialSummary.balance)}
                </span>
              </div>
              <div className="summary-row">
                <span>Persentase Penghematan:</span>
                <span className="percentage">
                  {financialSummary.income > 0 
                    ? ((financialSummary.balance / financialSummary.income) * 100).toFixed(1)
                    : 0
                  }%
                </span>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="dashboard-actions">
            <button className="action-btn primary">Tambah Transaksi</button>
            <button className="action-btn secondary">Lihat Laporan</button>
            <button className="action-btn tertiary">Atur Anggaran</button>
          </div>
        </div>
      ) : (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Memuat data dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;