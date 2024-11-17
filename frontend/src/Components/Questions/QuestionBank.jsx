import React, { useState } from 'react';
import './QuestionBank.css';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [popupQuestion, setPopupQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState('');

  const subjectQuestions = {
    "Digital Communication": [
      {
        id: 1,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      },
      {
        id: 2,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      }, {
        id: 3,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      }, {
        id: 4,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      }, {
        id: 5,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      }, {
        id: 6,
        text: 'What is modulation in digital communication?',
        options: ['Modifying a signal', 'Transmitting data', 'Varying a carrier signal', 'None of the above'],
        points: 5,
        difficulty: 'Easy',
        answer: 'Varying a carrier signal',
      },
      {
        id: 7,
        text: 'Define Nyquist rate.',
        options: ['Twice the maximum frequency', 'Half the frequency', 'Quarter of the frequency', 'None'],
        points: 10,
        difficulty: 'Medium',
        answer: 'Twice the maximum frequency',
      },
      // Add similar structure for other questions
    ],
  };

  const loadQuestionsBySubject = (subject) => {
    setQuestions(subjectQuestions[subject]);
    setSelectedSubject(subject);
    setIsSubjectSelected(true);
    setShowBookmarks(false);
    setSelectedDifficulty('');
  };

  const toggleBookmark = (question) => {
    setBookmarkedQuestions((prev) => {
      const isAlreadyBookmarked = prev.find((q) => q.id === question.id);
      if (isAlreadyBookmarked) {
        return prev.filter((q) => q.id !== question.id);
      } else {
        return [...prev, question];
      }
    });
  };

  
  const closeQuestionPage = () => {
    setQuestions([]);
    setIsSubjectSelected(false);
    setSelectedSubject('');
    setSelectedDifficulty('');
  };

  const showBookmarkPage = () => {
    setQuestions(bookmarkedQuestions);
    setIsSubjectSelected(true);
    setShowBookmarks(true);
    setSelectedDifficulty('');
  };

  const handleDifficultyChange = (event) => {
    setSelectedDifficulty(event.target.value);
  };

  const filteredQuestions = selectedDifficulty
    ? questions.filter((question) => question.difficulty === selectedDifficulty)
    : questions;

  const openPopup = (question) => {
    setPopupQuestion(question);
    setSelectedOption(null);
    setFeedback('');
  };

  const closePopup = () => {
    setPopupQuestion(null);
    setSelectedOption(null);
    setFeedback('');
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) {
      setFeedback('Please select an option.');
      return;
    }

    if (selectedOption === popupQuestion.answer) {
      setFeedback('Correct! 🎉');
    } else {
      setFeedback(`Incorrect. The correct answer is: ${popupQuestion.answer}`);
    }
  };

  return (
    <div className="question-bank-div">
      <h2 className="title">Question Bank</h2>
      <center>
        {!isSubjectSelected ? (
          <div className="subject-boxes">
            {Object.keys(subjectQuestions).map((subject, index) => (
              <button
                key={index}
                onClick={() => loadQuestionsBySubject(subject)}
                className="subject-box"
              >
                {subject}
              </button>
            ))}
            <button onClick={showBookmarkPage} className="bookmark-box">Bookmarks</button>
          </div>
        ) : (
          <>
            <h3>{showBookmarks ? 'Bookmarked Questions' : `${selectedSubject} Questions`}</h3>
            <div className="filter-container">
              <label htmlFor="difficulty-select" className="filter-label">Filter by Difficulty:</label>
              <select id="difficulty-select" value={selectedDifficulty} onChange={handleDifficultyChange} className="filter-select">
                <option value="">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="questions-list-div">
              <ul className="questions-list">
                {filteredQuestions.map((question, index) => (
                  <li key={question.id} className="question-item">
                    <div className="question-content">
                      <p className="question-text">
                        <span className="question-number">Question {index + 1}:</span> {question.text}
                      </p>
                      <p className="question-difficulty">Difficulty: {question.difficulty}</p>
                      <p>Points: {question.points}</p>
                    </div>
                    <button onClick={() => openPopup(question)} className="view-answer-button">View</button>
                    <button onClick={() => toggleBookmark(question)} className="bookmark-button">
                      {bookmarkedQuestions.find((q) => q.id === question.id) ? '★' : '☆'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={closeQuestionPage} className="close-button">Close</button>
          </>
        )}
      </center>

      {popupQuestion && (
        <div className="popup">
          <div className="popup-content">
            <h3>Question Details</h3>
            <p><strong>Question:</strong> {popupQuestion.text}</p>
            <p><strong>Options:</strong></p>
            <ul>
              {popupQuestion.options.map((option, idx) => (
                <li key={idx} className='popup-content-li'>
                  <label className='question-option-label'>
                    <input
                      type="radio"
                      name="options"
                      value={option}
                      onChange={() => handleOptionChange(option)}
                      checked={selectedOption === option}
                    />
                    <p>{option}</p>
                  </label>
                </li>
              ))}
            </ul>
            <div className='pop-up-bottom'>
            <button onClick={handleSubmit} className="submit-button">Submit</button>
            {feedback && <p className="feedback">{feedback}</p>}
            <button onClick={closePopup} className="close-button">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
