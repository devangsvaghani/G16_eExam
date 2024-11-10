import React, { useState } from 'react';
import './ForgetPassword.css';

const ForgetPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateEmail(email)) {
      // Implement password reset logic here
      console.log('Reset link sent to:', email);
      setSubmitted(true);
      setError('');
    } else {
      setError('Please enter a valid email address');
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <div className="forget-password-wrapper">
      <div className="forget-password-container">
        <h2>Forgot Your Password?</h2>
        <p>Enter your email address below and we'll send you a link to reset your password.</p>
        
        {submitted ? (
          <div className="success-message">
            <p>A reset link has been sent to your email!</p>
            <button onClick={onClose} className="close-button">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id = "fin"
            />
            {error && <p className="error-message">{error}</p>}
            <button type="submit" className="resetlink-button">Send Reset Link</button>
            <button onClick={onClose} className="close-button">Close</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
