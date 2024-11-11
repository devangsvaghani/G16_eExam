import React, { useState } from 'react';
import './QuestionBank.css'; // Import the new CSS file

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [isQuestionLoaded, setIsQuestionLoaded] = useState(false); // State to track if questions are loaded

  // Function to load example questions with Lorem Ipsum text on button click
  const loadQuestions = () => {
    const exampleQuestions = [
      { id: 1, text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit?', difficulty: 'Easy', category: 'General' },
      { id: 2, text: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua?', difficulty: 'Medium', category: 'General' },
      { id: 3, text: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat?', difficulty: 'Easy', category: 'General' },
      { id: 4, text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur?', difficulty: 'Easy', category: 'General' },
      { id: 5, text: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum?', difficulty: 'Easy', category: 'General' },
      { id: 6, text: 'Curabitur pretium tincidunt lacus?', difficulty: 'Medium', category: 'General' },
      { id: 7, text: 'Praesent libero. Sed cursus ante dapibus diam?', difficulty: 'Easy', category: 'General' },
      { id: 8, text: 'Sed nisi. Nulla quis sem at nibh elementum imperdiet?', difficulty: 'Easy', category: 'General' },
      { id: 9, text: 'Duis sagittis ipsum. Praesent mauris?', difficulty: 'Medium', category: 'General' },
      { id: 10, text: 'Fusce nec tellus sed augue semper porta. Mauris massa?', difficulty: 'Easy', category: 'General' },
      { id: 11, text: 'Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos?', difficulty: 'Medium', category: 'General' },
      { id: 12, text: 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc?', difficulty: 'Easy', category: 'General' },
      { id: 13, text: 'In hac habitasse platea dictumst?', difficulty: 'Medium', category: 'General' },
    ];
    setQuestions(exampleQuestions);
    setIsQuestionLoaded(true); // Set to true when questions are loaded
  };

  // Function to handle closing the question page
  const closeQuestionPage = () => {
    setQuestions([]); // Clear the questions
    setIsQuestionLoaded(false); // Set to false to show the initial state
  };

  return (
    <div className="question-bank">
      <h2 className="title">Question Bank</h2>
      <center><button onClick={loadQuestions} className="load-button">
        Load Questions
      </button></center>
      {isQuestionLoaded ? ( // Conditional rendering based on questions loaded
        <>
          <button onClick={closeQuestionPage} className="close-button">
            Close
          </button>
          <ul className="questions-list">
            {questions.map((question, index) => (
              <li key={question.id} className="question-item">
                <p className="question-text">
                  <span className="question-number">Question {index + 1}:</span> {question.text}
                </p>
                <p className="question-difficulty">Difficulty: {question.difficulty}</p>
                <p className="question-category">Category: {question.category}</p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className="no-questions-message"></p>
      )}
    </div>
  );
};

export default QuestionBank;
