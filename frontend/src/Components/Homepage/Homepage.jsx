// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Homepage.css';
import { Helmet } from 'react-helmet';
import logo from '../assets/logo.jpg'; // Import the logo

const Homepage = () => {

  return (
    
    <div className="homepage">
      <Helmet>
      <title>Online Examination System</title>
      <link rel="icon" href={logo} type="image/x-icon" />
      </Helmet>
      <header className="header">
        {/* Add the logo */}
        <div className="logo-container">
          <img src={logo} alt="Online Examination System Logo" className="logo" />
        </div>
        <h1>Online Examination System</h1>
        <nav className="navbar">
          <ul>
            <li><a href="#home">Home</a></li>
            <li><a href="#contact">Contact Us</a></li>
            {/* Use Link for navigation to Login page */}
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
      </header>

      <section className="hero" id="home">
        <h2>Welcome to the Online Exams</h2>
        <p>Take and create your tests and assessments from anywhere, anytime.</p>
        <button className="cta-btn">Get Started</button>
      </section>

      <section id="features" className="features">
        <h3>Features</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <h4>Secure Assessments</h4>
            <p>Your exams are protected with industry-leading security.</p>
          </div>
          <div className="feature-item">
            <h4>Real-Time Results</h4>
            <p>Get your scores as soon as you finish your exams.</p>
          </div>
          <div className="feature-item">
            <h4>Multiple Question Types</h4>
            <p>Supports multiple-choice, descriptive, true/false, and more.</p>
          </div>
          <div className="feature-item">
            <h4>User-Friendly Interface</h4>
            <p>Easily navigate through your exams with our intuitive UI.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <h3>Contact Us</h3>
        <p>For any inquiries, please reach out to us at: <strong>online@daiict.ac.in</strong></p>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Online Examination System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Homepage;
