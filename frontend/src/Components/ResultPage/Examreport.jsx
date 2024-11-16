import React from "react";
import "./Examreport.css";

const ExamResultCard = () => {
  const examDetails = {
    name: "Mathematics Final Exam",
    subject: "Mathematics",
    studentId: "12345",
    totalMarks: 100,
    obtainedMarks: 85,
    questions: [
      {
        question: "What is 2 + 2?",
        options: ["A) 3", "B) 4", "C) 5", "D) 6"],
        studentAnswer: "C) 5",
        correctAnswer: "B) 4",
      },
      {
        question: "What is the square root of 16?",
        options: ["A) 2", "B) 3", "C) 4", "D) 5"],
        studentAnswer: "C) 4",
        correctAnswer: "C) 4",
      },
      {
        question: "What is 10 / 2?",
        options: ["A) 4", "B) 5", "C) 6", "D) 7"],
        studentAnswer: "B) 5",
        correctAnswer: "B) 5",
      },
    ],
  };

  return (
    <div id="card-container">
      <div id="exam-card">
        <h2>{examDetails.name}</h2>
        <p><strong>Subject:</strong> {examDetails.subject}</p>
        <p><strong>Student ID:</strong> {examDetails.studentId}</p>
        <p><strong>Obtained Marks:</strong> {examDetails.obtainedMarks}/{examDetails.totalMarks}</p>

        <div id="questions-section">
          <h3>Questions and Responses</h3>
          {examDetails.questions.map((q, index) => (
            <div key={index} id="question-card">
              <p><strong>Question {index + 1}:</strong> {q.question}</p>
              <ul id="options-list">
                {q.options.map((option, optIndex) => (
                  <li
                    key={optIndex}
                    className={`option 
                    ${option === q.correctAnswer ? "correct-answer" : ""}`}
                  >
                    {option}
                    {option === q.studentAnswer && (
                      <span id="tickmark"> (✔ Student)</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamResultCard;
