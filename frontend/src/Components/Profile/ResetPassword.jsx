import React, { useState } from "react";
import './ResetPassword.css';
import { useNavigate } from "react-router-dom";
import ForgetPassword from "../Login/forgetpassword";

function ResetPassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isForgetPassOpen, setForgetOpen] = useState(false);
  const [error, setError] = useState("");

  const handleForget = () => {
    setForgetOpen(true);
  };

  const correctCurrentPassword = "oldPassword123"; // This should be replaced with real authentication

  const handleSubmit = (e) => {
    e.preventDefault();

    if (currentPassword !== correctCurrentPassword) {
      alert("The current password is incorrect.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    setError("");
    alert("Password reset successfully!");
  };
    const navigate = useNavigate();
  const handleClose = () => {
        
      navigate('/');
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
