import React, { useState } from 'react';
import './QuestionBank.css';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [isSubjectSelected, setIsSubjectSelected] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [answersVisibility, setAnswersVisibility] = useState({});
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('');

  const subjectQuestions = {
    "Digital Communication": [
      { id: 1, text: 'What is modulation in digital communication?', difficulty: 'Easy', answer: 'Modulation is the process of varying a carrier signal to transmit data.' },
      { id: 2, text: 'Define Nyquist rate.', difficulty: 'Medium', answer: 'Nyquist rate is twice the maximum frequency of a signal to avoid aliasing.' },
      { id: 3, text: 'Explain the concept of Time Division Multiplexing.', difficulty: 'Medium', answer: 'TDM allows multiple signals to share the same transmission medium by dividing time slots.' },
      { id: 4, text: 'What are the advantages of digital signals over analog signals?', difficulty: 'Easy', answer: 'Digital signals are less prone to noise and allow easier data processing and compression.' },
      { id: 5, text: 'Describe the role of error detection in digital communication.', difficulty: 'Medium', answer: 'Error detection helps identify and correct errors in data transmission to improve reliability.' },
    ],
    // ... (Add more subjects as needed)
    "Computer Networks": [
      { id: 6, text: 'What is the OSI model in computer networks?', difficulty: 'Easy', answer: 'The OSI model is a seven-layer framework for network communication standards.' },
      { id: 7, text: 'Explain the purpose of TCP/IP protocol.', difficulty: 'Medium', answer: 'TCP/IP is a suite of protocols to facilitate reliable data transmission over networks.' },
      { id: 8, text: 'Define the concept of subnetting.', difficulty: 'Hard', answer: 'Subnetting divides an IP network into smaller sub-networks for efficiency and security.' },
      { id: 9, text: 'What is a firewall, and how does it work?', difficulty: 'Medium', answer: 'A firewall is a security system that monitors and controls network traffic based on security rules.' },
      { id: 10, text: 'Describe the differences between IPv4 and IPv6.', difficulty: 'Easy', answer: 'IPv6 has a larger address space and improved security features compared to IPv4.' },
    ],
    "Software Engineering": [
      { id: 11, text: 'What is the SDLC in software engineering?', difficulty: 'Easy', answer: 'The SDLC is a process for planning, developing, and deploying software systems.' },
      { id: 12, text: 'Explain agile methodology.', difficulty: 'Medium', answer: 'Agile is a flexible development approach focused on iterative progress and collaboration.' },
      { id: 13, text: 'What is the purpose of requirement gathering?', difficulty: 'Easy', answer: 'Requirement gathering identifies the needs and constraints of the software project.' },
      { id: 14, text: 'Describe the role of testing in the software development process.', difficulty: 'Medium', answer: 'Testing ensures the software functions as expected and meets quality standards.' },
      { id: 15, text: 'What is a design pattern, and why is it used?', difficulty: 'Medium', answer: 'A design pattern is a reusable solution to common software design problems.' },
    ],
  };

  const loadQuestionsBySubject = (subject) => {
    setQuestions(subjectQuestions[subject]);
    setSelectedSubject(subject);
    setIsSubjectSelected(true);
    setAnswersVisibility({});
    setShowBookmarks(false);
    setSelectedDifficulty(''); // Reset difficulty filter when loading new subject
  };

  const toggleAnswerVisibility = (id) => {
    setAnswersVisibility((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

  return (
    <div className="question-bank">
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
            <button onClick={closeQuestionPage} className="close-button">
              Close
            </button>
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

            <ul className="questions-list">
              {filteredQuestions.map((question, index) => (
                <li key={question.id} className="question-item">
                  <div className="question-content">
                    <p className="question-text">
                      <span className="question-number">Question {index + 1}:</span> {question.text}
                    </p>
                    <p className="question-difficulty">{question.difficulty}</p>
                  </div>
                  <button onClick={() => toggleAnswerVisibility(question.id)} className="view-answer-button">
                    {answersVisibility[question.id] ? 'Hide Answer' : 'View Answer'}
                  </button>
                  {answersVisibility[question.id] && (
                    <p className="answer-text">{question.answer}</p>
                  )}
                  <button onClick={() => toggleBookmark(question)} className="bookmark-button">
                    {bookmarkedQuestions.find((q) => q.id === question.id) ? '★' : '☆'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
      </center>
    </div>
  );
};

export default QuestionBank;
