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
    const { setIsLoggedIn, validateUser, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (window.localStorage.getItem("token") !== null) {
            navigate("/dashboard");
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateEmail(email)) {
            try {
                const results = await axios.post(
                    (config.BACKEND_API || "http://localhost:8000") +
                        "/forgot-password",
                    {
                        email: email,
                    }
                );

                console.log(results);

                if (results.status === 200) {
                    toast.success(results.data.message);
                    setSubmitted(true);
                } else {
                    toast.error(results.data.message);
                }
            } catch (e) {
                console.log(e.response);

                toast.error(
                    e?.response?.data?.message || "Internal server error"
                );
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
            toast.error("Passwords does not match");
            return;
        }

        if (newPassword.length <= 8) {
            toast.error("Password length should be greater than 8");
            return;
        }

        try {
            const results = await axios.post(
                (config.BACKEND_API || "http://localhost:8000") + "/verify-otp",
                {
                    email: email,
                    otp: otp,
                    password: newPassword,
                }
            );

            console.log(results);

            if (results.status === 200) {
                toast.success(results.data.message);

                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } else {
                toast.error(results.data.message);
            }
        } catch (e) {
            console.log(e.response);

            toast.error(e?.response?.data?.message || "Internal server error");
        }
    };

    const handleResendOtp = async () => {
        try {
            const results = await axios.post(
                (config.BACKEND_API || "http://localhost:8000") +
                    "/resend-otp",
                {
                    email: email,
                }
            );

            console.log(results);

            if (results.status === 200) {
                toast.success(results.data.message);
                setSubmitted(true);
            } else {
                toast.error(results.data.message);
            }
        } catch (e) {
            console.log(e.response);

            toast.error(
                e?.response?.data?.message || "Internal server error"
            );
        }
    }

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    return (
        <div className="forget-password-wrapper">
            <div className="forget-password-container">
                <h2>Forgot Your Password?</h2>
                {submitted ? (
                    <p>OTP sent to your mail</p>
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
                            className="resend-otp"
                        >
                            Resent OTP
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
