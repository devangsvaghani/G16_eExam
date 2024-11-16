import React, { useState, useEffect } from "react";
import "./FetchedQuestions.css";

const FetchedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [points, setPoints] = useState(0);
  const [numOptions, setNumOptions] = useState(4);
  const [currentOptions, setCurrentOptions] = useState(['', '', '', '']);
  const [correctOption, setCorrectOption] = useState(null);
  const [difficulty, setDifficulty] = useState('');
  const [subjectName, setSubjectName] = useState('');

  useEffect(() => {
    const fetchedQuestions = [];
    setQuestions(fetchedQuestions);
    console.log("Fetched Questions:", fetchedQuestions);
  }, []);

  // Function to handle adding a new question
  const handleAddQuestion = () => {
    if (currentQuestion && correctOption !== null && difficulty && subjectName) {
      const newQuestion = {
        id: Date.now(),
        text: currentQuestion,
        options: currentOptions,
        correctAnswer: currentOptions[correctOption],
        difficulty,
        points,
        subjectName,
      };

      setQuestions([...questions, newQuestion]);
      // Reset fields
      setCurrentQuestion('');
      setPoints(0);
      setNumOptions(4);
      setCurrentOptions(['', '', '', '']);
      setCorrectOption(null);
      setDifficulty('');
      setSubjectName('');
    } else {
      alert("Please fill in all fields and select a correct option.");
    }
  };

  // Handle updating the options list when the number of options changes
  const handleNumOptionsChange = (e) => {
    const newNumOptions = Math.max(2, parseInt(e.target.value) || 4);
    setNumOptions(newNumOptions);

    // Adjust the currentOptions array to the new number of options
    setCurrentOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      if (newNumOptions > prevOptions.length) {
        // Add empty values for new options
        while (updatedOptions.length < newNumOptions) {
          updatedOptions.push('');
        }
      } else {
        // Remove options if new number is less
        updatedOptions.length = newNumOptions;
      }
      return updatedOptions;
    });
  };

  return (
    <div className="fetched-exam-container">
      <h1><center>Online Examination System</center></h1>
      <h2>Fetched Questions</h2>

      {/* Display existing questions */}
      {questions.length > 0 && (
        <div className="existing-questions">
          <ul className="question-list">
            {questions.map((question) => (
              <li key={question.id} className="question-item">
                <strong>Q:</strong> {question.text}
                <ul className="options-list">
                  {question.options.map((option, index) => (
                    <li
                      key={index}
                      className={`option ${index === question.correctOption ? "correct" : ""}`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
                <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                <p><strong>Difficulty:</strong> {question.difficulty}</p>
                <p><strong>Points:</strong> {question.points}</p>
                <p><strong>Subject:</strong> {question.subjectName}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Add new question */}
      <div className="create-question">
        <h3>Create a New Question</h3>

        {/* Subject dropdown */}
        <label className="input-label" htmlFor="subject">Select Subject:</label>
        <select
          id="subject"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="input-field"
        >
          <option value="" disabled>Select subject</option>
          <option value="Digital Communication">Digital Communication</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Computer Networks">Computer Networks</option>
        </select>

        <input
          type="text"
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
          placeholder="Enter question text"
          className="input-field"
        />
        <label className="input-label" htmlFor="points">Select Points:</label>
        <input
          id="points"
          type="number"
          value={points}
          onChange={(e) => setPoints(parseInt(e.target.value) || 0)}
          placeholder="Points"
          className="input-field"
        />
        <label className="input-label" htmlFor="numOptions">Select no of Options:</label>
        <input
          id="numOptions"
          type="number"
          value={numOptions}
          onChange={handleNumOptionsChange} // Update number of options
          placeholder="Number of Options"
          className="input-field"
        />
        <div className="option-div">
          {Array.from({ length: numOptions }).map((_, index) => (
            <div key={index} className="option-input">
              <input
                className="option-input-input"
                type="radio"
                name="correctOption"
                checked={correctOption === index}
                onChange={() => setCorrectOption(index)}
              />
              <input
                type="text"
                value={currentOptions[index] || ""}
                onChange={(e) =>
                  setCurrentOptions((prevOptions) =>
                    prevOptions.map((opt, i) =>
                      i === index ? e.target.value : opt
                    )
                  )
                }
                placeholder={`Option ${index + 1}`}
                className="input-field"
              />
            </div>
          ))}
        </div>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="input-field-select-field"
        >
          <option value="" disabled>
            Select difficulty
          </option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <button onClick={handleAddQuestion} className="add-question-button">
          Add Question
        </button>
      </div>
    </div>
  );
};

export default FetchedQuestions;
