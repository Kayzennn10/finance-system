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