import React, { useState, useEffect } from "react";
import "./ForgetPassword.css";
import { useAuth } from "../../context/auth.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import config from "../../config.js";

const ForgetPassword = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmNewPassword] = useState("");
    const [error, setError] = useState("");
    const [resendTimer, setResendTimer] = useState(0); // Timer state

    useEffect(() => {
        if (resendTimer > 0) {
            const timerId = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timerId);
        }
    }, [resendTimer]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateEmail(email)) {
            try {
                const results = await axios.post(
                    (config.BACKEND_API || "http://localhost:8000") +
                        "/forgot-password",
                    { email }
                );

                if (results.status === 200) {
                    toast.success(results.data.message);
                    setSubmitted(true);
                    setResendTimer(60); // Set timer to 60 seconds
                } else {
                    toast.error(results.data.message);
                }
            } catch (e) {
                toast.error(e?.response?.data?.message || "Internal server error");
            }
        } else {
            toast.error("Please enter a valid email address");
        }
    };

    const handleSubmitOtp = async (e) => {
        e.preventDefault();

        if (!otp || !newPassword || !confirmPassword) {
            toast.error("Fields should not be empty");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (newPassword.length < 8) {
            toast.error("Password length should be at least 8");
            return;
        }

        try {
            const results = await axios.post(
                (config.BACKEND_API || "http://localhost:8000") + "/verify-otp",
                { email, otp, password: newPassword }
            );

            if (results.status === 200) {
                toast.success(results.data.message);
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(results.data.message);
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || "Internal server error");
        }
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        try {
            const results = await axios.post(
                (config.BACKEND_API || "http://localhost:8000") + "/resend-otp",
                { email }
            );

            if (results.status === 200) {
                toast.success(results.data.message);
                setResendTimer(60); // Reset timer to 60 seconds
            } else {
                toast.error(results.data.message);
            }
        } catch (e) {
            toast.error(e?.response?.data?.message || "Internal server error");
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
                {submitted ? (
                    <p>OTP sent to your email</p>
                ) : (
                    <p>Enter your email address</p>
                )}

                {submitted ? (
                    <form onSubmit={handleSubmitOtp}>
                        <input
                            type="text"
                            placeholder="OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            id="fin"
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            id="fin"
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmNewPassword(e.target.value)
                            }
                            required
                            id="fin"
                        />
                        <p
                            type="button"
                            onClick={handleResendOtp}
                            className={`resend-otp ${
                                resendTimer > 0 ? "disabled" : ""
                            }`}
                            disabled={resendTimer > 0}
                        >
                            {resendTimer > 0
                                ? `Resend OTP in ${resendTimer}s`
                                : "Resend OTP"}
                        </p>
                        <button type="submit" className="resetlink-button">
                            Change Password
                        </button>
                        <button onClick={onClose} className="close-button">
                            Close
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            id="fin"
                        />
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="resetlink-button">
                            Send OTP
                        </button>
                        <button onClick={onClose} className="close-button">
                            Close
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgetPassword;
