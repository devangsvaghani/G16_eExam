import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage.jsx';
import Login from './Components/Login/Login.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
import StartExam from './Components/Exam/Startexam.jsx';

const App = () => {
  return (
    <>
    {/* <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router> */}
    {/* <Dashboard/> */}
    <StartExam/>
    </>
  );
};

export default App;
