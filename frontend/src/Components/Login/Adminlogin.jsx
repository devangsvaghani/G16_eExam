import React, { useState, useEffect } from 'react';
import './Adminlogin.css';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.png';
import close from '../assets/eye-closed.svg';
import open from '../assets/eye-opened.svg';
import { toast } from "react-toastify";
import axios from "axios";
import MoonLoader from "react-spinners/MoonLoader";
import config from "../../config.js";
import { useAuth } from "../../context/auth.jsx";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [authorizationCode, setauthorizationCode] = useState('');
  const [showCode, setshowCode] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (window.localStorage.getItem("token") === null) {
      validateUser();
    } else {
      navigate(-1);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission

    setLoading(true);

    if (!authorizationCode) {
      toast.error("Code is missing");
      setLoading(false);
      return;
    }
    
    try{
      const results = await axios.post(
        (config.BACKEND_API || "http://localhost:8000") +
          "/admin-login",
        {
          password: authorizationCode
        }
      );

      console.log(results);
      

      if(results.status === 200){
        window.localStorage.setItem("token", results.data.token);
        window.localStorage.setItem("username", results.data.username);
        setIsLoggedIn(true);
        toast.success("Login Successful");
        navigate("/admin");
      }else{
        toast.error(results.data.error);
      }
    }
    catch(e){
      console.log(e);
      
      toast.error("Internal server error");
    }

    setLoading(false);

  };

  return (
    isLoggedIn ? 
      <div>Admin Logged in</div>
    :
    <div className="login-container">
      <Helmet>
        <title>Administrator Login</title>
        <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <form onSubmit={handleLogin} className="login-form">
        <h2>Administrator Login</h2>
        <br />

        <label htmlFor="securitykey">Authorization Code</label>
        <br />
        <div className="password-container">
          {/* Password input field */}
          <input
            type={showCode ? 'text' : 'password'}
            id="password"
            name="password"
            value={authorizationCode}
            onChange={(e) => setauthorizationCode(e.target.value)}
            placeholder="Enter Authorization Code"
            required
          />

          {/* Button to toggle password visibility */}
          <button
            type="button"
            onClick={() => setshowCode(!showCode)}
            className="eye-button"
          >
            {showCode ?
              <img src={close} alt="Hide password" /> :
              <img src={open} alt="Show password" />
            }
          </button>
        </div>

        {/* Submit button */}
        <button type="submit" className="login-button">
          Login
        </button>

        <MoonLoader
          color="red"
          loading={loading}
          size={60}
        />

        {/* Remember me and forgot password section */}
      </form>

    </div>
  );
}

export default Login;