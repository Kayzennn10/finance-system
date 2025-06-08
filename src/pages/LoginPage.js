import React, { useState } from 'react';
import axios from 'axios';
import './LoginPage.css';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('token', response.data.token);  // Simpan token JWT ke localStorage
    window.location.href = '/dashboard';  // Redirect ke dashboard setelah login berhasil
  } catch (err) {
    alert('Login failed! Invalid credentials.');
  }
    };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="Enter email" 
          className="input-field"
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          placeholder="Enter password" 
          className="input-field"
        />
        <button onClick={handleLogin} className="login-btn">Login</button>
        
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
