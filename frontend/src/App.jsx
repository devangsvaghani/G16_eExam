import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Login from './index.js'; // Import your Login component
import Homepage from './Components/Homepage/Homepage.jsx';
import Login from './Components/Login/Login.jsx';
//import {Login} from './Components/index.js';
const App = () => {
  return (
    <>
    <Router>
      <Routes>
        {/* Define the route for the HomePage */}
        <Route path="/" element={<Homepage />} />
        {/* Define the route for the Login page */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
    
    </>
  );
};

export default App;
