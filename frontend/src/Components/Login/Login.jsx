import React, { useState } from 'react';
import './Login.css';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.png'; 
import close from '../assets/eye-closed.svg';
import open from '../assets/eye-opened.svg';
import ForgetPassword from './forgetpassword.jsx'; // Import the ForgetPassword component

const Login = ({ onClose }) => {
  // States for form fields and password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgetPassword, setShowForgetPassword] = useState(false); 

  // Function triggered on form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch('https://your-backend-api.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, role, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        // Handle successful login (e.g., save token, redirect, etc.)
      } else {
        setErrorMessage(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
      console.error('Error:', error);
    }
  };

  const handleForgotPasswordClick = () => {
    setShowForgetPassword(true); // Show the forget password form
  };

  const handleCloseForgetPassword = () => {
    setShowForgetPassword(false); // Close the forget password form and return to login
  };

  return (
    <div>
      <Helmet>
        <title>Login</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      
      <div className="login-container">
        {showForgetPassword ? (
          // Render ForgetPassword component when state is true
          <ForgetPassword onClose={handleCloseForgetPassword} />
        ) : (
          // Otherwise, render the Login form
          <form onSubmit={handleLogin} className="login-form">
            <h2>Login</h2>
            <br />

            {/* Role dropdown */}
            <label htmlFor="role">Role</label>
            <br />
            <div className="select-container">
              <select
                id="role" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                aria-label="Select Role"
              >
                <option value="student">Student</option>
                <option value="examiner">Examiner</option>
              </select>
            </div>

            {/* Username input */}
            <label htmlFor="username">Username</label>
            <br />
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
            <br />

            {/* Password input with toggle visibility */}
            <label htmlFor="password">Password</label>
            <br />
            <div className="password-container">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="eye-button"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <img src={close} alt="Hide password" />
                ) : (
                  <img src={open} alt="Show password" />
                )}
              </button>
            </div>

            {/* Error message */}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Submit button */}
            <button type="submit" className="login-button">
              Login
            </button>
            <button type="button" onClick={onClose} className="close-button">
              Close
            </button>

            {/* Remember me and forgot password */}
            <div className="remember-forgot">
              <label className="remember-me-label">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <br />
              <p
                type="button"
                onClick={handleForgotPasswordClick}
                className="forgot-password"
              >
                Forgot Password?
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
