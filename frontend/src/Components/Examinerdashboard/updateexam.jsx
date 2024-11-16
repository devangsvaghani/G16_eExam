import React, { useState, useEffect } from "react";
import "./updateexam.css";
import Examinerdashboard from "./Examinerdashboard";

const UpdateExam = ({ onClose }) => {
  const [exam, setExam] = useState({
    name: "Sample Exam",
    duration: 60,
    date: "2024-12-01",
    time: "10:00",
    syllabus: "Array, Linked List, Stacks, Queues, Trees",
    extraNotes: "Focus on problem-solving and key concepts.",
    questions: [
      {
        id: 1,
        text: "What is your favorite type of cuisine?",
        options: ["Italian", "Chinese", "Mexican", "Indian"],
        correctOption: 0,
        marks: 5,
      },
      {
        id: 2,
        text: "What type of transportation do you use most often?",
        options: ["Car", "Bicycle", "Public Transport", "Walking"],
        correctOption: 1,
        marks: 5,
      },
      {
        id: 3,
        text: "How often do you exercise in a week?",
        options: ["1-2 times", "3-4 times", "5-6 times", "I don't exercise"],
        correctOption: 1,
        marks: 5,
      },
      {
        id: 4,
        text: "Which device do you use most frequently for browsing the internet?",
        options: ["Laptop/PC", "Smartphone", "Tablet", "Smartwatch"],
        correctOption: 1,
        marks: 5,
      },
      {
        id: 5,
        text: "What is your primary source of news?",
        options: ["Television", "Internet/Social Media", "Newspaper", "Radio"],
        correctOption: 2,
        marks: 5,
      },
      {
        id: 6,
        text: "How often do you order food online?",
        options: ["Never", "Once a week", "Once a month", "Multiple times a week"],
        correctOption: 3,
        marks: 5,
      },
      {
        id: 7,
        text: "What time do you usually wake up in the morning?",
        options: ["Before 6 AM", "6 AM to 7 AM", "7 AM to 8 AM", "After 8 AM"],
        correctOption: 2,
        marks: 5,
      },
      {
        id: 8,
        text: "Do you prefer to travel internationally or domestically?",
        options: ["Internationally", "Domestically", "Both equally", "Neither, I don’t travel much"],
        correctOption: 0,
        marks: 5,
      },
      {
        id: 9,
        text: "What kind of movies do you prefer to watch?",
        options: ["Action", "Comedy", "Drama", "Horror"],
        correctOption: 1,
        marks: 5,
      },
      {
        id: 10,
        text: "What is your preferred method of communication?",
        options: ["Text messages", "Phone calls", "Video calls", "Emails"],
        correctOption: 0,
        marks: 5,
      }
    ],
  });

  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCancelExamModal, setShowCancelExamModal] = useState(false);
  const [Isclosepage, setIsclosepage] = useState(false);

  // Function to calculate total marks
  const calculateTotalMarks = () => {
    const sum = exam.questions.reduce((acc, question) => acc + question.marks, 0);
    setTotalMarks(sum);
  };

  // Recalculate total marks whenever questions array changes
  useEffect(() => {
    calculateTotalMarks();
  }, [exam.questions]);

  const validateDateTime = () => {
    const currentDate = new Date();
    const selectedDateTime = new Date(`${exam.date}T${exam.time}`);
    if (selectedDateTime <= currentDate) {
      alert("Please select a valid date and time in the future.");
      return false;
    }
    return true;
  };

  const saveExamDetails = () => {
    if (!validateDateTime()) return;
    alert("Exam details saved successfully!");
  };
  const handleclosepage = () => {
    setIsclosepage(true);
  }

  const handleQuestionSelect = (id) => {
    const question = exam.questions.find((q) => q.id === id);
    setSelectedQuestion({ ...question });
    setShowModal(true);
  };

  const handleQuestionUpdate = (field, value) => {
    setSelectedQuestion((prevQuestion) => ({
      ...prevQuestion,
      [field]: value,
    }));
  };

  const handleOptionUpdate = (index, value) => {
    setSelectedQuestion((prevQuestion) => {
      const updatedOptions = [...prevQuestion.options];
      updatedOptions[index] = value;
      return { ...prevQuestion, options: updatedOptions };
    });
  };

  const addOption = () => {
    setSelectedQuestion((prevQuestion) => ({
      ...prevQuestion,
      options: [...prevQuestion.options, ""],
    }));
  };

  const removeOption = (index) => {
    setSelectedQuestion((prevQuestion) => {
      const updatedOptions = prevQuestion.options.filter((_, i) => i !== index);
      return { ...prevQuestion, options: updatedOptions };
    });
  };

  const saveQuestionUpdate = () => {
    setExam((prevExam) => ({
      ...prevExam,
      questions: prevExam.questions.map((q) =>
        q.id === selectedQuestion.id ? selectedQuestion : q
      ),
    }));
    setShowModal(false);
    setSelectedQuestion(null);
  };

  const saveNewQuestion = () => {
    setExam((prevExam) => ({
      ...prevExam,
      questions: [
        ...prevExam.questions,
        { ...selectedQuestion, id: prevExam.questions.length + 1 },
      ],
    }));
    setShowModal(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = (id) => {
    const questionToDelete = exam.questions.find((q) => q.id === id);
    if (
      window.confirm(
        `Do you want to delete the question: "${questionToDelete.text}"?`
      )
    ) {
      setExam((prevExam) => ({
        ...prevExam,
        questions: prevExam.questions.filter((q) => q.id !== id),
      }));
    }
  };

  const handleCancelExam = () => {
    setShowCancelExamModal(true);
  };

  const confirmCancelExam = () => {
    alert("Exam has been cancelled.");
    setShowCancelExamModal(false);
    setExam(null);
  };

  const addNewQuestion = () => {
    setSelectedQuestion({
      text: "",
      options: ["Option 1", "Option 2"],
      correctOption: 0,
      marks: 1,
    });
    setShowModal(true);
  };

  return (
    <div className="update-exam-div">
    <div className="update-exam-container">
      <h1>Update Exam</h1>

      <div className="exam-details">
        <label>
          Exam Name:
          <input
            type="text"
            name="name"
            value={exam.name}
            onChange={(e) => setExam({ ...exam, name: e.target.value })}
          />
        </label>

        <label>
          Exam Duration (minutes):
          <input
            type="number"
            name="duration"
            value={exam.duration}
            onChange={(e) => setExam({ ...exam, duration: e.target.value })}
          />
        </label>

        <label>
          Exam Date:
          <input
            type="date"
            name="date"
            value={exam.date}
            onChange={(e) => setExam({ ...exam, date: e.target.value })}
          />
        </label>

        <label>
          Exam Time:
          <input
            type="time"
            name="time"
            value={exam.time}
            onChange={(e) => setExam({ ...exam, time: e.target.value })}
          />
        </label>

        <label>
          Total Marks: <b>{totalMarks}</b>
        </label>

        <label>
          Syllabus:
          <textarea
            name="syllabus"
            value={exam.syllabus}
            onChange={(e) => setExam({ ...exam, syllabus: e.target.value })}
          />
        </label>

        <div className="buttons-container">
          <button
            className="edit-questions-btn"
            onClick={() => setShowQuestions(!showQuestions)}
          >
            Edit Questions
          </button>
          <button className="add-question-btn" onClick={addNewQuestion}>
            Add Question
          </button>
          <button className="cancel-exam-btn" onClick={handleCancelExam}>
            Cancel Exam
          </button>
        </div>

        {showQuestions && (
          <div className="update-questions">
            <ul>
              {exam.questions.map((question) => (
                <li key={question.id}>
                  <div className="question-item">
                    <span>{question.text}</span>
                    <button
                      className="update-btn"
                      onClick={() => handleQuestionSelect(question.id)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteQuestion(question.id)}
                      style={{ marginLeft: "10px" }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="buttons-container">
          <button className="save-btn" onClick={saveExamDetails}>
            Save Exam Details
            </button>
            <button className="closebtn" onClick={onClose}>
              Close 
            </button>
        </div>
      </div>

      {showModal && selectedQuestion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{selectedQuestion.id ? "Edit Question" : "Add New Question"}</h3>
            <label>
              Question Text:
              <textarea
                value={selectedQuestion.text}
                onChange={(e) => handleQuestionUpdate("text", e.target.value)}
              />
            </label>

            <label>Options:</label>
            <div className="options-container">
              {selectedQuestion.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionUpdate(index, e.target.value)}
                  />
                  <input
                    type="radio"
                    name="correctOption"
                    checked={selectedQuestion.correctOption === index}
                    onChange={() =>
                      handleQuestionUpdate("correctOption", index)
                    }
                  />
                  <button
                    className="remove-btn"
                    onClick={() => {
                      if (selectedQuestion.options.length > 2) {
                        removeOption(index);
                      } else {
                        alert("A question must have at least two options.");
                      }
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <button className="add-option-btn" onClick={addOption}>
              Add Option
            </button>
            <label>
              Marks:
              <input
                type="number"
                value={selectedQuestion.marks}
                onChange={(e) =>
                  handleQuestionUpdate("marks", parseInt(e.target.value, 10))
                }
              />
            </label>

            <div className="modal-buttons">
              <button
                className="save-question-btn"
                onClick={
                  selectedQuestion.id ? saveQuestionUpdate : saveNewQuestion
                }
              >
                Save
              </button>
              <button
  className="cancel-btn"
  onClick={() => {
    setShowModal(false);
    setSelectedQuestion(null);
  }}
>
  Cancel
</button>
            </div>
          </div>
        </div>
      )}

      {showCancelExamModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cancel Exam</h3>
            <p>Are you sure you want to cancel this exam?</p>
            <div className="modal-buttons">
              <button className="confirm-btn" onClick={confirmCancelExam}>
                Yes, Cancel
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowCancelExamModal(false)}
              >
                No, Keep
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
      </div>
      );
      
};

export default UpdateExam;