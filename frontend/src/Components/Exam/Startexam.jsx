import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./Startexam.css";

const StartExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  const targetDate = new Date("November 15, 2024 00:05:00").getTime();
  const [currentTime, setCurrentTime] = useState(new Date().getTime());
  const [countdown, setCountdown] = useState(targetDate - currentTime);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showError, setShowError] = useState(false);
  const [testCountdown, setTestCountdown] = useState(null);

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
      navigate("/exam");
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
    const hours = Math.floor(time / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const showStartButton = countdown <= 0;

  return (
    <div className="start-exam-container">
      <div className="exam-container">
        <h1 className="heading">{examId}</h1>
        <div className="professor-name">
          <p>
            <strong>Created by:</strong> Professor John Smith
          </p>
        </div>
        <div className="info">
          <p>
            <strong>User:</strong> John Doe (ID: 12345)
          </p>
          <p>
            <strong>Time Remaining:</strong> 60:00
          </p>
        </div>
        <div className="instructions">
          <p>
            <strong>Instructions:</strong>
          </p>
          <ul>
            <li>You have 60 minutes to complete the exam.</li>
            <li>There are 50 questions in total.</li>
            <li>
              Click the "Start Test" button when the countdown reaches zero.
            </li>
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
              I agree to the terms and conditions, including that I will not
              engage in any form of academic dishonesty or use unauthorized
              assistance during the test.
            </label>
          </div>
        </div>
        {showError && (
          <div className="error-message">
            Please agree to the terms and conditions before starting the test.
          </div>
        )}
        {!showStartButton ? (
          <div className="countdown">
            Time until the Start button appears:{" "}
            <strong>{formatCountdown(countdown)}</strong>
          </div>
        ) : testCountdown !== null ? (
          <div className="countdown">
            The test will start in <strong>{testCountdown}</strong> seconds.
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
