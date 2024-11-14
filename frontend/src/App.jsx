

import React, { useState } from 'react';

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage.jsx';
import Login from './Components/Login/Login.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
// import StartExam from './Components/Exam/Startexam.jsx';
// import StudentProfile from './Components/Profile/StudentProfile.jsx';
// import QuestionBank from './Components/Questions/QuestionBank.jsx';
// import FetchedQuestions from './Components/Questions/FetchedQuestions.jsx';
// import OverallPerformance from './Components/Questions/OverallPerformance.jsx'
// import StudentExamPage from './Components/StudentExamPage/StudentExamPage.jsx';
// import ResultPage from './Components/ResultPage/ResultPage.jsx';
// import ExaminerProfile from './Components/Profile/ExaminerProfile.jsx';
// import Upcomingexam from './Components/Exam/Upcomingexam.jsx';
// import Pastexam from './Components/Exam/Pastexam.jsx';
// import Examinterface from './Components/Examinterface/Examinterface.jsx'


const App = () => {
  const [events, setEvents] = useState({}); // State to hold events
  // const exams = [
  //   {
  //     name: 'Mathematics Final Exam',
  //     date: '04/05/2023',
  //     startTime: '10:00 AM',
  //     duration: '02:00:00',
  //     startIn: '9 days 8 hours 3 minutes',
  //     instructor: 'Dr. John Doe',
  //     totalMarks: 100,
  //     hours: '2',
  //     description: 'Comprehensive final exam covering all topics in the syllabus.'
  //   },
  //   {
  //     name: 'Physics Midterm',
  //     date: '04/06/2023',
  //     startTime: '12:00 PM',
  //     duration: '01:30:00',
  //     startIn: '7 days 6 hours 15 minutes',
  //     instructor: 'Prof. Alice Johnson',
  //     totalMarks: 75,
  //     hours: '1.5',
  //     description: 'Midterm covering classical mechanics and thermodynamics.'
  //   },
  //   {
  //     name: 'Chemistry Quiz',
  //     date: '04/07/2023',
  //     startTime: '09:00 AM',
  //     duration: '01:00:00',
  //     startIn: '5 days 2 hours 40 minutes',
  //     instructor: 'Dr. Emily Brown',
  //     totalMarks: 50,
  //     hours: '1',
  //     description: 'Quiz on organic chemistry basics.'
  //   },
  //   {
  //     name: 'History Exam',
  //     date: '04/08/2023',
  //     startTime: '11:00 AM',
  //     duration: '02:00:00',
  //     startIn: '8 days 11 hours 25 minutes',
  //     instructor: 'Prof. Mark Green',
  //     totalMarks: 100,
  //     hours: '2',
  //     description: 'Exam covering significant events from the 20th century.'
  //   },
  //   {
  //     name: 'Biology Test',
  //     date: '04/09/2023',
  //     startTime: '08:30 AM',
  //     duration: '01:45:00',
  //     startIn: '10 days 4 hours 50 minutes',
  //     instructor: 'Dr. Sarah Lee',
  //     totalMarks: 80,
  //     hours: '1.75',
  //     description: 'Test on human anatomy and physiology.'
  //   },
  //   {
  //     name: 'Geography Quiz',
  //     date: '04/10/2023',
  //     startTime: '10:15 AM',
  //     duration: '01:15:00',
  //     startIn: '6 days 9 hours 30 minutes',
  //     instructor: 'Prof. Michael Scott',
  //     totalMarks: 60,
  //     hours: '1.25',
  //     description: 'Quiz on world geography and map skills.'
  //   },
  //   {
  //     name: 'Computer Science Final',
  //     date: '04/11/2023',
  //     startTime: '01:00 PM',
  //     duration: '02:30:00',
  //     startIn: '4 days 7 hours 20 minutes',
  //     instructor: 'Dr. David Chen',
  //     totalMarks: 120,
  //     hours: '2.5',
  //     description: 'Final exam covering algorithms and data structures.'
  //   },
  //   {
  //     name: 'English Literature Exam',
  //     date: '04/12/2023',
  //     startTime: '02:00 PM',
  //     duration: '02:00:00',
  //     startIn: '3 days 5 hours 45 minutes',
  //     instructor: 'Ms. Lisa White',
  //     totalMarks: 90,
  //     hours: '2',
  //     description: 'Exam on British and American literature.'
  //   },
  //   {
  //     name: 'Art Theory Quiz',
  //     date: '04/13/2023',
  //     startTime: '09:45 AM',
  //     duration: '01:00:00',
  //     startIn: '12 days 3 hours 10 minutes',
  //     instructor: 'Mr. Kevin Robinson',
  //     totalMarks: 50,
  //     hours: '1',
  //     description: 'Quiz on art movements and theories from the Renaissance.'
  //   },
  //   {
  //     name: 'Economics Midterm',
  //     date: '04/14/2023',
  //     startTime: '11:30 AM',
  //     duration: '01:30:00',
  //     startIn: '2 days 8 hours 5 minutes',
  //     instructor: 'Dr. Nancy Adams',
  //     totalMarks: 75,
  //     hours: '1.5',
  //     description: 'Midterm exam covering microeconomic principles.'
  //   }
  // ];
  // const sampleResults = [
  //   {
  //     examName: "Math Exam",
  //     date: "2024-10-10",
  //     score: "85%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "Science Exam",
  //     date: "2024-10-11",
  //     score: "90%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "History Exam",
  //     date: "2024-10-12",
  //     score: "75%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "English Exam",
  //     date: "2024-10-13",
  //     score: "60%",
  //     status: "Failed"
  //   },
  //   {
  //     examName: "Computer Science Exam",
  //     date: "2024-10-14",
  //     score: "95%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "Geography Exam",
  //     date: "2024-10-15",
  //     score: "70%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "Physics Exam",
  //     date: "2024-10-16",
  //     score: "80%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "Chemistry Exam",
  //     date: "2024-10-17",
  //     score: "55%",
  //     status: "Failed"
  //   },
  //   {
  //     examName: "Biology Exam",
  //     date: "2024-10-18",
  //     score: "88%",
  //     status: "Passed"
  //   },
  //   {
  //     examName: "Literature Exam",
  //     date: "2024-10-19",
  //     score: "92%",
  //     status: "Passed"
  //   },
  // ];
  return (
    <>
      {/* <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
      </Routes> */}
    {/* <QuestionBank/> */}
     {/* <Dashboard/>  */}
     {/* <FetchedQuestions /> */}
     {/* <OverallPerformance /> */}
     {/* <ResultPage /> */}
     {/* <StudentExamPage /> */}
    {/* <StartExam/> */}
   {/* <StudentProfile/>*/}
   {/* <ExaminerProfile/> */}
   {/* <Upcomingexam exams={exams} />  */}
   {/* <Pastexam results={sampleResults} /> */}
      {/* <Examinterface/> */}
      <Dashboard/>
    </>
  );
};

export default App;




