import React, { useState, useEffect } from 'react';
import './Examinterface.css';
import SubmitConfirmationModal from './SubmitConfirmationModal';
import user from '../assets/user.png';

function Examinterface() {
    const [timeRemaining, setTimeRemaining] = useState(30000);
    const [isActive, setIsActive] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false); 
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [autoSubmit, setAutoSubmit] = useState(false); // Auto-submit flag
    

    const questions = [
      { text: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], points: 3 },
      { text: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Venus", "Jupiter"], points: 2 },
      { text: "Who wrote 'To Kill a Mockingbird'?", options: ["Harper Lee", "Jane Austen", "Mark Twain", "J.K. Rowling"], points: 4 },
      { text: "What is the largest mammal?", options: ["Elephant", "Blue Whale", "Shark", "Giraffe"], points: 3 },
      { text: "In which year did World War II end?", options: ["1939", "1945", "1942", "1948"], points: 5 },
      
  ];

    const [questionStatuses, setQuestionStatuses] = useState(Array(questions.length).fill("unanswered"));
    const [response, setResponse] = useState(Array(questions.length).fill(null));
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const totalpoints = questions.reduce((sum,question)=>sum+question.points,0);
    useEffect(() => {
        let intervalId;

        if (isActive && timeRemaining > 0) {
            intervalId = setInterval(() => {
                setTimeRemaining(prevTime => prevTime - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            clearInterval(intervalId);
            setIsActive(false);
            alert("Time's up!");
        }

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [isActive, timeRemaining]);

    const formatTime = (totalSeconds) => {
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return { hours, minutes, seconds };
    };
    const [tabSwitched, setTabSwitched] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                setTabSwitched(true); // Set state when tab is switched
            }
            if (tabSwitched && document.visibilityState === "visible") {
                alert("Exam Submitted due to tab switching!!");
                setAutoSubmit(true); // Trigger auto-submit
                setShowSubmitConfirm(true); // Show the confirmation modal or directly submit
            }
        };

        // Add event listener
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [tabSwitched]); // Add `tabSwitched` as a dependency
    
    useEffect(() => {
        // Handle back button (popstate)
        const handlePopState = (event) => {
            event.preventDefault();
            setShowSubmitConfirm(true); // Open the modal
            window.history.pushState(null, null, window.location.href); // Prevent actual navigation
        };

        // Handle page reload or close (beforeunload)
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            //setShowSubmitConfirm(true); // Open the modal
            event.returnValue = ""; // For modern browsers
        };

        window.addEventListener("popstate", handlePopState);
        window.addEventListener("beforeunload", handleBeforeUnload);

        // Push state initially to prevent back navigation
        window.history.pushState(null, null, window.location.href);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    const { hours, minutes, seconds } = formatTime(timeRemaining);

    const handleQuestionClick = (index) => {
      setCurrentQuestionIndex(index);
      setSelectedAnswer(response[index]);
  };

  const handleAnswerSelect = (index) => {
      setSelectedAnswer(index);
  };

  const updateQuestionStatus = (status) => {
      setQuestionStatuses(prevStatuses => {
          const updatedStatuses = [...prevStatuses];
          updatedStatuses[currentQuestionIndex] = status;
          return updatedStatuses;
      });
  };
  
  const updateResponse = (index) => {
    setResponse(prevResponse => {
        const updatedResponse = [...prevResponse];
        updatedResponse[currentQuestionIndex] = index;
        return updatedResponse;
    });
};
  
  const handleClear = () => {  
      updateResponse(null);
      setSelectedAnswer(null);
      updateQuestionStatus("unanswered");
  };

  const handleReviewLater = () => {
    if (selectedAnswer === null) {
        updateResponse(null);
        updateQuestionStatus("review-later");
    } else {
        updateResponse(selectedAnswer);
        updateQuestionStatus("review-answered");
    }
  };

  const handleSaveandNext = () => {
      if (selectedAnswer !== null) {
          updateResponse(selectedAnswer);
          updateQuestionStatus("answered");
      }
  };

  const handleSaveAndMarkReview = () => {
    if (selectedAnswer !== null) {
      updateResponse(selectedAnswer);
      updateQuestionStatus("review-answered");
    }
  }

const handleCloseSubmitConfirm = () => {
    setShowSubmitConfirm(false);
};

  const SaveandNext = () => {
      handleSaveandNext();
      if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedAnswer(null);
      }
  };
  

  return (
    <div className="exampage">
        <header className="Head">
            <div className='Exam'>
                <h1 className="exam-title">Subject (Code)</h1>
                <div className="examtype">Mid-Semester Exam</div>
            </div>
            <div className="professor">
                <p>By</p>
                <p>Prof name</p>
            </div>
        </header>

        <div className="maincontent">
            <aside className="questionnav">
                <div>
                    <div className="time">
                        <p>Time left</p>
                        <span>{hours}:</span><span>{minutes}:</span><span>{seconds}</span>
                    </div>
                    <br />
                    <div className="ques">
                        <h3>Questions</h3>
                        <div className="question-list">
                            {questions.map((_, index) => (
                                <button
                                    key={index}
                                    className={`question-btn ${questionStatuses[index]}`}
                                    onClick={() => handleQuestionClick(index)}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flag">
                    <p className="flag-btn">Flag</p>
                    <div>
                        <div className="flagindicator">
                            <span className="color-box review-later"></span> Review Later
                        </div>
                        <div className="flagindicator">
                            <span className="color-box answered"></span> Answered
                        </div>
                        <div className="flagindicator">
                            <span className="color-box unanswered"></span> Unanswered
                        </div>
                        <div className="flagindicator">
                            <span className="color-box review-answered"></span> Marked for Review and Answered
                        </div>
                    </div>
                </div>
            </aside>

            <div className="question-area">
                <div className='question-area-div'>
                    <h2>Question {currentQuestionIndex + 1}</h2>
                    <p>{questions[currentQuestionIndex].text}</p>
                    <p className="points">({questions[currentQuestionIndex].points} points)</p>
                    <div className="opts">
                        {questions[currentQuestionIndex].options.map((option, i) => (
                            <label key={i}>
                                <input
                                    type="radio"
                                    name="answer"
                                    checked={selectedAnswer === i}
                                    onChange={() => handleAnswerSelect(i)}
                                /> {String.fromCharCode(65 + i)}) {option}
                            </label>
                        ))}
                    </div>
                </div>
                <div className="btns">
                    <div className='other-btn'>
                        <button className="Clr" onClick={handleClear}>Clear</button>
                        <button className="SnN" onClick={() => SaveandNext()}>Save & Next</button>
                        <button className="SnMR" onClick={handleSaveAndMarkReview}>Save & Mark for Review</button>
                        <button className="MRnN" onClick={handleReviewLater}>Mark for Review</button>
                    </div>
                    <div className="nav-btns">
                        <button disabled={currentQuestionIndex === 0} onClick={() => {
                          setCurrentQuestionIndex(currentQuestionIndex - 1);
                          setSelectedAnswer(response[currentQuestionIndex - 1]);
                          }}>&larr;</button>
                        <button disabled={currentQuestionIndex === questions.length - 1} onClick={() => {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                          setSelectedAnswer(response[currentQuestionIndex + 1]);
                          }}>&rarr;</button>
                    </div>
                </div>
            </div>

           <aside className="profilebar">
                <div className='profile'>
                    <img src={user} alt="" />
                    <h3 className="ques">Nishank Kansara</h3>
                    <p>202201111</p>
                </div>
                <div className="mark-details">
                    <p>Total question : {questions.length}</p>
                    <p>Total points : {totalpoints} </p>
                    <p>Attempted : {questionStatuses.filter(status => status === "answered" || status === "review-answered").length}</p>
                    <p>Review later : {questionStatuses.filter(status => status === "review-later" || status === "review-answered").length}</p>
                </div>
                <button className="submit-btn" onClick={() => setShowSubmitConfirm(true)}>Submit</button>
            </aside>
        </div>
            {showSubmitConfirm && (
                <SubmitConfirmationModal
                autoSubmit={autoSubmit}
                    onCancel={handleCloseSubmitConfirm}
                />
            )}
    </div>
);
}

export default Examinterface;
