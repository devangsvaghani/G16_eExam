import React, { useState, useEffect } from "react";
import './ResetPassword.css';
import ForgetPassword from "../Login/forgetpassword";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import config from "../../config.js";
import { useAuth } from "../../context/auth.jsx";
import axios from "axios";
import { toast } from "react-toastify";

function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isForgetPassOpen, setForgetOpen] = useState(false);
  const [error, setError] = useState("");

  const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Cookies.get("token")) {
        navigate("/");
    }
}, []);

  const handleForget = () => {
    setForgetOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if(newPassword !== confirmPassword){
        setError("Password Does not match");
        return;
    }

    if(newPassword.length < 8){
        toast.error("Password must be at least 8 characters long");
        return;
    }

    try{

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
        };

        const result = await axios.post(
            (config.BACKEND_API || "http://localhost:8000") +
                `/reset-password`,{
                    old_password: currentPassword,
                    new_password: newPassword
                },
            { headers }
        );

        console.log(result);

        toast.success(result.data.message);

        setTimeout(() => {
            navigate(-1);
        }, 1000);
    }catch(e){
        console.log(e);

        toast.error(e?.response?.data?.message || "Internal server error");
    }
  };
  
  ;
  const handleClose = () => {
        
      navigate(-1);
  };

  const handleCloseForget = () => {
    setForgetOpen(false);
  };

  return (
    <div className="resetpwdcont">
      <div className={`container ${isForgetPassOpen ? "blur" : ""}`}>
        <h2>Reset Password</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter your current password"
            required
          />
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter your new password"
            required
          />
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your new password"
            required
          />
          {error && <p className="error">{error}</p>}
          <p type="button" className="forgetpass" onClick={handleForget}>Forget Password?</p>
          <input className="reset-button" type="submit" value="Reset Password" />
          <button type="button" className="close-btn" onClick={handleClose}>Close</button>
        </form>
      </div>
      {isForgetPassOpen && <ForgetPassword onClose={handleCloseForget} />}
    </div>
  );
}

export default ResetPassword;
