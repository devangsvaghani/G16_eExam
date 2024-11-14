import React, { useState, useEffect } from 'react';
import './Login.css';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.png';
import close from '../assets/eye-closed.svg';
import open from '../assets/eye-opened.svg';
import ForgetPassword from './forgetpassword.jsx'; // Import the ForgetPassword component
import config from "../../config.js";
import { useAuth } from "../../context/auth.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import { toast } from "react-toastify";

const Login = ({ onClose }) => {
  // States for form fields and password visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('Student');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (window.localStorage.getItem("token") !== null) {
      navigate("/dashboard");
    }
  }, []);

  // Function triggered on form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    if (!username || !password) {
      toast.error("Fields are missing");
      setLoading(false);
      return;
    }


    try {
      const results = await axios.post(
        (config.BACKEND_API || "http://localhost:8000") +
        "/create-session",
        {
          emailUsername: username,
          password: password
        }
      );

      console.log(results);


      if (results.status === 200) {
        window.localStorage.setItem("token", results.data.token);
        window.localStorage.setItem("username", results.data.username);
        setIsLoggedIn(true);
        toast.success("Login Successful");
        navigate("/dashboard");
      } else {
        toast.error(results.data.error);
      }
    }
    catch (e) {
      // console.log(e.response);
      
      toast.error((e?.response?.data?.error) || ("Internal server error"));
    }

    setLoading(false);
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
                <option value="Student">Student</option>
                <option value="Examiner">Examiner</option>
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
              <MoonLoader
                color="red"
                loading={loading}
                size={60}
              />
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
