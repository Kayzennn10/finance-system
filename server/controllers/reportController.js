import db from '../config/db.js';

export const getFinancialReport = async (req, res) => {
  const { type, userId } = req.params;
  const { year } = req.query;

  if (!userId || !year) {
    return res.status(400).json({ msg: 'User ID and year are required' });
  }

  let query;
  let queryParams = [userId];

  if (type === 'monthly') {
    query = `
      SELECT
        DATE_FORMAT(transaction_date, '%Y-%m') AS period,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = ? AND YEAR(transaction_date) = ?
      GROUP BY period
      ORDER BY period ASC
    `;
    queryParams.push(year);
  } else if (type === 'yearly') {
    query = `
      SELECT
        YEAR(transaction_date) AS period,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = ? AND YEAR(transaction_date) = ?
      GROUP BY period
      ORDER BY period ASC
    `;
    queryParams.push(year);
  } else {
    return res.status(400).json({ msg: 'Invalid report type. Must be monthly or yearly.' });
  }

  try {
    const [rows] = await db.query(query, queryParams);
    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getFinancialSummary = async (req, res) => {
  const { userId } = req.params;
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  try {
    const [summary] = await db.query(
      `
      SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ?
      `,
      [userId, currentMonth, currentYear]
    );

    const income = summary[0].income || 0;
    const expenses = summary[0].expenses || 0;
    const balance = income - expenses;
    const budgetStatus = balance >= 0 ? 'On Track' : 'Over Budget'; // Simplified for now

    res.json({ income, expenses, balance, budgetStatus });
  } catch (err) {
    console.error('Error fetching financial summary:', err.message);
    res.status(500).send('Server Error');
  }
};

export const getMonthlyData = async (req, res) => {
  const { userId } = req.params;

  try {
    const [monthlyData] = await db.query(
      `
      SELECT
        DATE_FORMAT(transaction_date, '%b') AS month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
      FROM transactions
      WHERE user_id = ?
      GROUP BY MONTH(transaction_date), YEAR(transaction_date)
      ORDER BY YEAR(transaction_date) ASC, MONTH(transaction_date) ASC
      LIMIT 6
      `,
      [userId]
    );

    res.json(monthlyData);
  } catch (err) {
    console.error('Error fetching monthly data:', err.message);
    res.status(500).send('Server Error');
  }
}; 