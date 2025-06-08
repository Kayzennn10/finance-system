import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './ReportPage.css'; // Make sure to create this CSS file

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ReportPage = () => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('monthly'); // 'monthly' or 'yearly'
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i); // Last 5 years

  useEffect(() => {
    fetchReportData();
  }, [reportType, selectedYear]);

  const fetchReportData = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage after login
      if (!token || !userId) {
        setError('No token or user ID found. Please login.');
        setLoading(false);
        return;
      }

      const response = await axios.get(`http://localhost:5000/api/reports/${reportType}/${userId}?year=${selectedYear}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setReportData(response.data);
    } catch (err) {
      setError('Failed to fetch report data.');
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `\Tren Keuangan \${reportType === 'monthly' ? 'Bulanan' : 'Tahunan'} ${selectedYear}`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    },
  };

  const labels = reportData.map(item => item.period);
  const incomeData = reportData.map(item => item.income);
  const expenseData = reportData.map(item => item.expenses);

  const data = {
    labels,
    datasets: [
      {
        label: 'Pendapatan',
        data: incomeData,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.5)',
        tension: 0.4,
      },
      {
        label: 'Pengeluaran',
        data: expenseData,
        borderColor: '#F44336',
        backgroundColor: 'rgba(244, 67, 54, 0.5)',
        tension: 0.4,
      },
    ],
  };

  if (loading) {
    return <div className="report-loading">Memuat laporan...</div>;
  }

  if (error) {
    return <div className="report-error">Error: {error}</div>;
  }

  return (
    <div className="report-container">
      <h1>Laporan Keuangan</h1>
      <div className="report-controls">
        <label>
          Tipe Laporan:
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
          </select>
        </label>
        <label>
          Tahun:
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      {reportData.length > 0 ? (
        <div className="report-charts">
          <Line options={chartOptions} data={data} />
          <Bar options={chartOptions} data={data} />
        </div>
      ) : (
        <div className="no-data">Tidak ada data laporan untuk periode ini.</div>
      )}

      <div className="report-summary">
        <h2>Ringkasan</h2>
        {reportData.map((item, index) => (
          <div key={index} className="summary-item">
            <h3>{item.period}</h3>
            <p>Pendapatan: {formatCurrency(item.income)}</p>
            <p>Pengeluaran: {formatCurrency(item.expenses)}</p>
            <p>Selisih: {formatCurrency(item.income - item.expenses)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportPage; 