import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Homepage from './Components/Homepage/Homepage.jsx';
// import Login from './Components/Login/Login.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
// import StartExam from './Components/Exam/Startexam.jsx';
// import StudentProfile from './Components/Profile/StudentProfile.jsx';
import QuestionBank from './Components/Questions/QuestionBank.jsx';
import FetchedQuestions from './Components/Questions/FetchedQuestions.jsx';
import OverallPerformance from './Components/Questions/OverallPerformance.jsx'
import StudentExamPage from './Components/StudentExamPage/StudentExamPage.jsx';
import ResultPage from './Components/ResultPage/ResultPage.jsx';

const App = () => {
  return (
    <>
    {/* <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router> */}
    {/* <QuestionBank/> */}
     {/* <Dashboard/>  */}
     {/* <FetchedQuestions /> */}
     {/* <OverallPerformance /> */}
     {/* <ResultPage /> */}
     <StudentExamPage />
    {/* <StartExam/> */}
   {/* <StudentProfile/>*/}
    </>
  );
};

export default App;
