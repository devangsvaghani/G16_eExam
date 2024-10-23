import React, { useState } from 'react';
import './Login.css';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.jpg'; // Import the logo
import close from '../assets/eye-closed.svg';
import open from '../assets/eye-opened.svg';

const Login = () => {
  // State for handling username input
  const [username, setUsername] = useState('');
  
  // State for handling password input
  const [password, setPassword] = useState('');
  
  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  // State for "Remember me" checkbox
  const [rememberMe, setRememberMe] = useState(false);
  
  // State for handling the role (Examineer or Student)
  const [role, setRole] = useState('');
  
  // State for role validation message
  const [roleError, setRoleError] = useState('');

  // Function triggered on form submission
  const handleLogin = (e) => {
    e.preventDefault(); // Prevents the default form submission

    // Reset error state initially
    setRoleError('');

    // If role is not selected, show specific warning text below the dropdown
    if (!role) {
      setRoleError('Please select the role.');
      return;
    }

    // If username and password are not filled, show alert
    if (!username || !password) {
      alert('Please enter both username and password.');
      return;
    }

    // For demo purposes, logging the form data to console
    console.log('Role:', role);
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Remember me:', rememberMe);
  };

  return (
    <div className="login-container">
       <Helmet>
      <title>Login</title>
      <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      {/* Login form */}
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
          >
           
            
            <option value="student">Student</option>
            <option value="examineer">Examineer</option>
          </select>
        </div>
        {/* Display role error message if role is not selected */}
        {roleError && <p className="error-message">{roleError}</p>}
        
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

        {/* Password input */}
        <label htmlFor="password">Password</label>
        <br />
        <div className="password-container">
          {/* Password input field */}
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          
          {/* Button to toggle password visibility */}
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)} 
            className="eye-button"
          >
            {showPassword ? 
              <img src={close} alt="Hide password" /> : 
              <img src={open} alt="Show password" />
            }
          </button>
        </div>

        {/* Submit button */}
        <button type="submit" className="login-button">
          Login
        </button>

        {/* Remember me and forgot password section */}
        <div className="remember-forgot">
          {/* Remember me checkbox */}
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
          {/* Forgot password link */}
          <a href="#" className="forgot-password">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
