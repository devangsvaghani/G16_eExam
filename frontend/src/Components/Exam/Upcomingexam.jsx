import React from "react";
import "./Upcomingexam.css";
import { useNavigate } from "react-router-dom";

const Upcomingexam = ({ exams }) => {
  const navigate = useNavigate();

  const startExam = (examName) => {
    navigate(`/startexam/${examName}`);
  };

  return (
    <div className="uexam-list-container">
      <h2 className="uhead">Upcoming Exams</h2>
      <div className="exam-table">
        <div className="utable-header">
          <div className="uheader-item">Exam</div>
          <div className="uheader-item">Date</div>
          <div className="uheader-item">Start Time</div>
          <div className="uheader-item">Duration</div>
          <div className="uheader-item">Start In</div>
          <div className="uheader-item">Detail</div>
        </div>
        {exams.map((exam, index) => (
          <div key={index} className="utable-row">
            <div className="utable-cell">{exam.name}</div>
            <div className="utable-cell">{exam.date}</div>
            <div className="utable-cell">{exam.startTime}</div>
            <div className="utable-cell">{exam.duration}</div>
            <div className="utable-cell">{exam.startIn}</div>
            <div className="utable-cell detail-cell">
              <button className="ubutton" onClick={() => startExam(exam.name)}>
                👁 View
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="urecords-info">
        Records: 1 to {exams.length} of {exams.length}
      </div>
    </div>
  );
};

export default Upcomingexam;
