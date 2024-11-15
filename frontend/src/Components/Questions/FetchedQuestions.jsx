import React, { useState, useEffect } from "react";
import "./FetchedQuestions.css";

const FetchedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    id: null,
    text: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    difficulty: ""
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
    if (newQuestion.text && newQuestion.correctAnswer && newQuestion.difficulty) {
      const questionWithId = {
        ...newQuestion,
        id: Date.now() // Generate a unique ID using the current timestamp
      };
      setQuestions([...questions, questionWithId]);
      setNewQuestion({ id: null, text: "", options: ["", "", "", ""], correctAnswer: "", difficulty: "" });
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
              <li key={question.id} className="question-item">
                <strong className="question-label">Q:</strong>
                <span className="question-text">{question.text}</span>
                <ul className="options-list">
                  {question.options.map((option, idx) => (
                    <li key={idx} className="option">{option}</li>
                  ))}
                </ul>
                <p className="correct-answer"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                <p className="difficulty"><strong>Difficulty:</strong> {question.difficulty}</p>
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
        
        <select
          name="difficulty"
          value={newQuestion.difficulty}
          onChange={handleInputChange}
          className="input-field select-field"
        >
          <option value="" disabled>
            Select difficulty
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

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
