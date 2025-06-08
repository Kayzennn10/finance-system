import React, { useState } from 'react';
import axios from 'axios';
import './SignUpPage.css';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // Reset error state
    setError('');
    setLoading(true);

    // Validasi frontend
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    console.log('Sign Up data:', { name, email, password: '***hidden***' });

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', 
        { 
          name: name.trim(), 
          email: email.trim().toLowerCase(), 
          password 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 10000, // 10 second timeout
        }
      );

      console.log('Registration response:', response.data);
      alert('Registration successful!');
      
      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      
      // Redirect ke halaman login
      window.location.href = '/';

    } catch (err) {
      console.error('Full error object:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = 'Registration failed! Please try again.';
      
      if (err.response) {
        // Server responded with error status
        console.error('Error status:', err.response.status);
        console.error('Error data:', err.response.data);
        
        if (err.response.data) {
          if (typeof err.response.data === 'string') {
            errorMessage = err.response.data;
          } else if (err.response.data.error) {
            errorMessage = err.response.data.error;
          } else if (err.response.data.message) {
            errorMessage = err.response.data.message;
          }
        }
        
        // Handle specific HTTP status codes
        switch (err.response.status) {
          case 400:
            if (err.response.data.includes && err.response.data.includes('Email already in use')) {
              errorMessage = 'This email is already registered. Please use a different email.';
            }
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 404:
            errorMessage = 'Registration endpoint not found. Please check server configuration.';
            break;
          default:
            break;
        }
      } else if (err.request) {
        // Request was made but no response received
        console.error('No response received:', err.request);
        errorMessage = 'No response from server. Please check if the server is running.';
      } else {
        // Something else happened
        console.error('Request setup error:', err.message);
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h2>Sign Up</h2>
        
        {error && (
          <div className="error-message" style={{
            color: 'red', 
            marginBottom: '10px', 
            padding: '10px', 
            border: '1px solid red', 
            borderRadius: '4px',
            backgroundColor: '#ffe6e6'
          }}>
            {error}
          </div>
        )}
        
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Enter name" 
          className="input-field"
          disabled={loading}
        />
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Enter email" 
          className="input-field"
          disabled={loading}
        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          onKeyPress={handleKeyPress}
          placeholder="Enter password (min 6 characters)" 
          className="input-field"
          disabled={loading}
        />
        <button 
          onClick={handleSignUp} 
          className="signup-btn"
          disabled={loading}
          style={{
            opacity: loading ? 0.6 : 1,
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className="login-link">
          <p>Already have an account? <Link to="/">Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;