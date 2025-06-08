const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Fungsi untuk registrasi (Sign Up) - Improved
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('Received registration data:', { name, email, password: '***hidden***' });

    // Validasi input yang lebih ketat
    if (!name || !email || !password) {
      console.log('Missing fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ 
        error: 'All fields are required',
        missing: {
          name: !name,
          email: !email, 
          password: !password
        }
      });
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validasi panjang password
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Cek apakah email sudah terdaftar - Using Promise wrapper
    const checkEmailQuery = () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    const existingUsers = await checkEmailQuery();
    
    if (existingUsers.length > 0) {
      console.log('Email already in use:', email);
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Enkripsi password dengan salt rounds yang lebih tinggi
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Password hashed successfully');

    // Insert user dengan Promise wrapper
    const insertUserQuery = () => {
      return new Promise((resolve, reject) => {
        db.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name, email, hashedPassword],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
    };

    const result = await insertUserQuery();
    
    console.log('User registered successfully with ID:', result.insertId);
    res.status(201).json({ 
      message: 'User registered successfully',
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific MySQL errors
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    if (error.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table not found' });
    }
    if (error.code === 'ECONNREFUSED') {
      return res.status(500).json({ error: 'Database connection failed' });
    }
    
    res.status(500).json({ 
      error: 'Error registering user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk login - Improved
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Cek apakah email terdaftar
    const getUserQuery = () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    const users = await getUserQuery();

    if (users.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verifikasi password dengan async
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Generate token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    res.json({ 
      message: 'Login successful', 
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Server error during login',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fungsi untuk mendapatkan data pengguna (Dashboard) - Improved
const getUserData = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access denied, no token provided' });
    }

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET not found in environment variables');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verifikasi token dengan Promise
    const verifyTokenAsync = (token, secret) => {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(err);
          else resolve(decoded);
        });
      });
    };

    const decoded = await verifyTokenAsync(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    // Ambil data pengguna dari database
    const getUserQuery = () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT id, name, email FROM users WHERE id = ?', [userId], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
    };

    const users = await getUserQuery();

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(users[0]);

  } catch (error) {
    console.error('Get user data error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ error: 'Token expired' });
    }
    
    res.status(500).json({ 
      error: 'Server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = { register, login, getUserData };