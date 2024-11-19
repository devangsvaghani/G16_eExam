import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Startexam.css";
import { toast } from "react-toastify";
import config from "../../config.js";
import axios from "axios";
import Cookies from "js-cookie";

const StartExam = () => {
    const { examId } = useParams();
    const navigate = useNavigate();

    const targetDate = new Date("November 16, 2024 16:35:00").getTime();
    const [currentTime, setCurrentTime] = useState(new Date().getTime());
    const [countdown, setCountdown] = useState(targetDate - currentTime);
    const [consentGiven, setConsentGiven] = useState(false);
    const [showError, setShowError] = useState(false);
    const [testCountdown, setTestCountdown] = useState(null);
    const [exam, setExam] = useState({});

    useEffect(() => {
        if (!Cookies.get("token") || Cookies.get("role") !== "Student") {
            navigate("/");
        }

        fetch_exam();
    }, []);

    const fetch_exam = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            };

            const result = await axios.get(
                (config.BACKEND_API || "http://localhost:8000") +
                    `/fetch-exam-student/${examId}`,
                { headers }
            );
            console.log(result);
            

            if (result.status !== 200) {
                toast.error(result?.data?.message || "Internal server error");
                return;
            }
            
            setExam(result.data.exam);
        } catch (e) {
            console.log(e);
            toast.error(e?.response?.data?.message || "Internal Server Error");
            navigate(-1);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            setCurrentTime(now);
            setCountdown(targetDate - now);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    useEffect(() => {
        if (testCountdown === 0) {
            navigate(`/exams/${examId}`);
        } else if (testCountdown > 0) {
            const timer = setInterval(() => {
                setTestCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [testCountdown, navigate]);

    const handleConsentChange = () => {
        setConsentGiven(!consentGiven);
        setShowError(false);
    };

    const startTest = () => {
        if (!consentGiven) {
            setShowError(true);
            return;
        }
        setTestCountdown(10);
    };

    const formatCountdown = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24)); // Calculate days
        const hours = Math.floor(
            (time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ); // Remaining hours
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
        const seconds = Math.floor((time % (1000 * 60)) / 1000); // Remaining seconds

        if (days > 0) {
            // Format to include days
            return `${days} days ${hours
                .toString()
                .padStart(2, "0")} hours ${minutes
                .toString()
                .padStart(2, "0")} minutes`;
        } else {
            // Format without days
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        }
    };

    const showStartButton = countdown <= 0;

    return (
        <div className="start-exam-container">
            <div className="exam-container">
                <h1 className="heading">{exam?.title}</h1>
                <div className="professor-name">
                    <p>
                        <strong>Created by:</strong> {exam?.creator}
                    </p>
                </div>
                <div className="info">
                    <p>
                        <strong>User:</strong> {Cookies.get("username")}
                    </p>
                    <p>
                        <strong>Exam Duration:</strong> {exam?.duration} minutes
                    </p>
                </div>
                <div className="instructions">
                    <p>
                        <strong>Instructions:</strong>
                    </p>
                    <ul>
                        {
                            exam?.instructions && exam?.instructions.map((line, index) => (
                                <li key={index}>{line}</li>
                            ))
                        }
                    </ul>
                </div>
                <div className="consent">
                    <div className="checkbox">
                        <input
                            type="checkbox"
                            checked={consentGiven}
                            onChange={handleConsentChange}
                        />
                    </div>
                    <div>
                        <label>
                            I agree to the terms and conditions, including that
                            I will not engage in any form of academic dishonesty
                            or use unauthorized assistance during the test.
                        </label>
                    </div>
                </div>
                {showError && (
                    <div className="error-message">
                        Please agree to the terms and conditions before starting
                        the test.
                    </div>
                )}
                {!showStartButton ? (
                    <div className="countdown">
                        Time until the Start button appears:{" "}
                        <strong>{formatCountdown(countdown)}</strong>
                    </div>
                ) : testCountdown !== null ? (
                    <div className="countdown">
                        The test will start in <strong>{testCountdown}</strong>{" "}
                        seconds.
                    </div>
                ) : (
                    <button className="start-btn" onClick={startTest}>
                        Start Test
                    </button>
                )}
            </div>
            <footer className="footer">
                <p>
                    For technical support, contact:{" "}
                    <a href="mailto:support@example.com">support@example.com</a>
                </p>
                <p>&copy; 2024 Mathematics Department, Example University</p>
            </footer>
        </div>
    );
};

export default StartExam;
