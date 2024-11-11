import React, { useState, useEffect } from "react";
import "./FetchedQuestions.css";

const FetchedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctAnswer: ""
  });

  useEffect(() => {
    const fetchedQuestions = [];
    setQuestions(fetchedQuestions);
    console.log("Fetched Questions:", fetchedQuestions);
  }, []);

  const handleInputChange = (e, index = null) => {
    const { name, value } = e.target;
    if (name === "option" && index !== null) {
      const updatedOptions = [...newQuestion.options];
      updatedOptions[index] = value;
      setNewQuestion({ ...newQuestion, options: updatedOptions });
    } else {
      setNewQuestion({ ...newQuestion, [name]: value });
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.text && newQuestion.correctAnswer) {
      setQuestions([...questions, newQuestion]);
      setNewQuestion({ text: "", options: ["", "", "", ""], correctAnswer: "" });
    } else {
      alert("Please fill in all fields.");
    }
  };

  return (
    <div className="container">
      <div className="existing-questions">
        {questions.length > 0 && (
          <ul className="question-list">
            {questions.map((question, index) => (
              <li key={index} className="question-item">
                <strong className="question-label">Q:</strong>
                <span className="question-text">{question.text}</span>
                <ul className="options-list">
                  {question.options.map((option, idx) => (
                    <li key={idx} className="option">{option}</li>
                  ))}
                </ul>
                <p className="correct-answer"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="create-question">
        <h3 className="subtitle">Create a New Question</h3>
        <input
          type="text"
          name="text"
          placeholder="Enter question text"
          value={newQuestion.text}
          onChange={handleInputChange}
          className="input-field"
        />
        {newQuestion.options.map((option, index) => (
          <input
            key={index}
            type="text"
            name="option"
            placeholder={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleInputChange(e, index)}
            className="input-field"
          />
        ))}
        <input
          type="text"
          name="correctAnswer"
          placeholder="Correct answer"
          value={newQuestion.correctAnswer}
          onChange={handleInputChange}
          className="input-field"
        />
        <button 
          onClick={handleAddQuestion} 
          className="add-question-button"
        >
          Add Question
        </button>
      </div>
    </div>
  );
};

export default FetchedQuestions;
