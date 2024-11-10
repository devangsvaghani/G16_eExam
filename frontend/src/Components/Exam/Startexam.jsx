import React, { useState, useEffect } from 'react';
import './Startexam.css';

function ExamPage() {
  const [countdown, setCountdown] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleConsentChange = () => {
    setConsentGiven(!consentGiven);
    setShowError(false); // Hide error message when consent is given
  };

  const startTest = () => {
    if (!consentGiven) {
      setShowError(true);
      return;
    }
    setCountdown(10); // Start countdown from 10 seconds
    setTestStarted(true);
  };

  useEffect(() => {
    if (countdown === 0) {
      alert('Test Started!');
      // Add test start logic here
      setTestStarted(false);
    }
    if (countdown && countdown > 0) {
      const timer = setInterval(() => setCountdown(countdown - 1),1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="container">
      <div className="exam-container">
        <h1 className="heading">Mathematics Final Exam</h1>

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
            <li>Click the "Start Test" button when ready.</li>
          </ul>
        </div>

        <div className="consent">
        <div className="checkbox"><input
            type="checkbox"
            checked={consentGiven}
            onChange={handleConsentChange}
          />
        </div>
        <div>
        <label htmlFor="consent-checkbox">
            I agree to the terms and conditions, including that I will not engage in any form of academic dishonesty or use unauthorized assistance during the test.
          </label>
        </div>
        </div>

        {/* Display error message if consent is not selected */}
        {showError && (
          <div className="error-message">
            Please agree to the terms and conditions before starting the test.
          </div>
        )}

        {testStarted && countdown > 0 && (
          <div className="countdown">
            The test will start in <strong>{countdown}</strong> seconds.
          </div>
        )}
        <br/>

        {!testStarted && (
          <button className="start-btn" onClick={startTest}>
            Start Test
          </button>
        )}
      </div>
      <footer className="footer">
        <p>
          For technical support, contact: <a href="mailto:support@example.com">support@example.com</a>
        </p>
        <p>&copy; 2024 Mathematics Department, Example University</p>
      </footer>
    </div>
  );
}

export default ExamPage;