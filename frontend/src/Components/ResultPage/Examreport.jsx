import React, { useEffect, useState } from "react";
import "./Examreport.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config.js";
import { useNavigate } from "react-router-dom";

const ExamResultCard = ({ exam }) => {
    const navigate = useNavigate();
    const [examDetails, setExamDetails] = useState(null);

    useEffect(() => {
        if (!Cookies.get("token") || Cookies.get("role") !== "Student") {
            navigate("/");
        }

        fetch_exam_details();
    }, []);

    const fetch_exam_details = async () => {
        try {
            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${Cookies.get("token")}`,
            };

            const result = await axios.get(
                (config.BACKEND_API || "http://localhost:8000") +
                    `/show-exam/${exam?.examId}`,
                { headers }
            );

            if (result.status !== 200) {
                toast.error(result.data.message);
                return;
            }

            console.log(exam);
            
            
            setExamDetails(result.data);
        } catch (e) {
            console.log(e);
            toast.error(e?.response?.data?.message || "Internal server error");
        }
    }

//   const examDetails = {
//     name: "Mathematics Final Exam",
//     subject: "Mathematics",
//     studentId: "12345",
//     totalMarks: 100,
//     obtainedMarks: 85,
//     questions: [
//       {
//         question: "What is 2 + 2?",
//         options: ["A) 3", "B) 4", "C) 5", "D) 6"],
//         studentAnswer: "C) 5",
//         correctAnswer: "B) 4",
//       },
//       {
//         question: "What is the square root of 16?",
//         options: ["A) 2", "B) 3", "C) 4", "D) 5"],
//         studentAnswer: "C) 4",
//         correctAnswer: "C) 4",
//       },
//       {
//         question: "What is 10 / 2?",
//         options: ["A) 4", "B) 5", "C) 6", "D) 7"],
//         studentAnswer: "B) 5",
//         correctAnswer: "B) 5",
//       },
//     ],
//   };

  return (
    <div id="card-container">
      <div id="exam-card">
        <h2>{exam?.title}</h2>
        <p><strong>Subject:</strong> {exam?.subject}</p>
        <p><strong>Student ID:</strong> {Cookies.get("username")}</p>
        <p><strong>Obtained Marks:</strong> {exam?.obtainedPoints}/{exam?.totalPoints}</p>

        <div id="questions-section">
          <h3>Questions and Responses</h3>
          {examDetails?.questions && examDetails.questions.map((q, index) => (
            <div key={index} id="question-card">
              <p><strong>Question {index + 1}:</strong> {q.description}</p>
              <ul id="options-list">
                {q.options.map((option, optIndex) => (
                  <li
                    key={optIndex}
                    className={`option 
                    ${option === q.options[q.correctAnswer] ? "correct-answer" : ""}`}
                  >
                    {option}
                    {option === q.options[q.selectedAnswer] && (
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
