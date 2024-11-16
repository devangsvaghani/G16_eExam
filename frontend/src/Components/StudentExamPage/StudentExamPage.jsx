import React, { useState, useEffect } from "react";
import "./StudentExamPage.css";

const StudentExamPage = () => {
  const [pastExams, setPastExams] = useState([]);
  const [upcomingExams, setUpcomingExams] = useState([]);

  useEffect(() => {
    // Fetch past and upcoming exams data (replace with actual API calls)
    const fetchedPastExams = [
      { id: 1, title: "Computer Networks", date: "2024-09-15", score: 88 },
      { id: 2, title: "Software Engineering", date: "2024-08-20", score: 92 },
      { id: 3, title: "Human Computer Interaction", date: "2024-09-15", score: 88 },
      { id: 4, title: "Solid State Devices", date: "2024-08-20", score: 92 },
    ];
    const fetchedUpcomingExams = [
      { id: 5, title: "Machine Learning", date: "2024-11-20" },
      { id: 6, title: "Physics of Semiconductor", date: "2024-12-05" },
      { id: 7, title: "Machine Learning", date: "2024-11-20" },
      { id: 8, title: "Physics of Semiconductor", date: "2024-12-05" },
    ];

    setPastExams(fetchedPastExams);
    setUpcomingExams(fetchedUpcomingExams);
  }, []);

  return (
    <div className="exam-page">
      <h1 className="exam-page-title">My Exams</h1>

      <div className="exam-section">
        <h2 className="exam-section-title">Upcoming Exams</h2>
        <div className="exam-list">
          {upcomingExams.length > 0 ? (
            upcomingExams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <h3>{exam.title}</h3>
                <p>Date: {exam.date}</p>
                <button className="view-btn">View Details</button>
              </div>
            ))
          ) : (
            <p>No upcoming exams.</p>
          )}
        </div>
      </div>

      <div className="exam-section">
        <h2 className="exam-section-title">Past Exams</h2>
        <div className="exam-list">
          {pastExams.length > 0 ? (
            pastExams.map((exam) => (
              <div key={exam.id} className="exam-card">
                <h3>{exam.title}</h3>
                <p>Date: {exam.date}</p>
                <p>Score: {exam.score}%</p>
                <button className="view-btn">Review Exam</button>
              </div>
            ))
          ) : (
            <p>No past exams available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentExamPage;
