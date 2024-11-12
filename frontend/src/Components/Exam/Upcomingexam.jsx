import React, { useState } from 'react';
import './Upcomingexam.css'

const Upcomingexam = ({ exams }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleDetails = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="uexam-list-container">
      <h2 className="uhead">Upcoming Exams</h2>
      <div className="tabs"></div>
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
          <React.Fragment key={index}>
            <div className="utable-row">
              <div className="utable-cell">{exam.name}</div>
              <div className="utable-cell">{exam.date}</div>
              <div className="utable-cell">{exam.startTime}</div>
              <div className="utable-cell">{exam.duration}</div>
              <div className="utable-cell">{exam.startIn}</div>
              <div className="utable-cell detail-cell">
                <button className="ubutton"  onClick={() => toggleDetails(index)}>👁 View</button>
              </div>
            </div>
            {expandedIndex === index && (
              <div className="utable-row expanded-details">
                <div className="utable-cell" colSpan="6">
                  <div><strong>Instructor:</strong> {exam.instructor}</div>
                  <div><strong>Total Marks:</strong> {exam.totalMarks}</div>
                  <div><strong>Hours:</strong> {exam.hours}</div>
                  <div><strong>Exam Type:</strong> {exam.description}</div>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="urecords-info">Records: 1 to {exams.length} of {exams.length}</div>
    </div>
  );
};

export default Upcomingexam;
