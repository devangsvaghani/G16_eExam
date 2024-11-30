import React, { useState, useEffect } from "react";
import "./CreateExam.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config.js";
import Loading from "../Loader/Loding.jsx"


const CreateExam = ({ onClose, questionBank, toast, fetchAgain }) => {
  const [step, setStep] = useState(1);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [isloaderon, setisloaderon] = useState(false);


  // Step 1: Basic Details
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [degree, setDegree] = useState("B.Tech");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");
  const [totalmarks, settotalmarks] = useState(0);
  const [instructions, setInstructions] = useState("");

  // Step 2: Timing Details
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");


  // Step 3: Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [numOptions, setNumOptions] = useState(4);
  const [correctOption, setCorrectOption] = useState(null);
  const [points, setpoints] = useState(0);
  const [currentOptions, setCurrentOptions] = useState(Array(numOptions).fill(""));

  useEffect(() => {
    // Adjust the options array whenever the number of options changes
    setCurrentOptions((prevOptions) => {
      const updatedOptions = [...prevOptions];
      while (updatedOptions.length < numOptions) {
        updatedOptions.push(""); // Add empty options if increasing
      }
      return updatedOptions.slice(0, numOptions); // Trim excess options if decreasing
    });
  }, [numOptions]);



  // Modal for Question Bank
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBankQuestions, setSelectedBankQuestions] = useState([]);

  // Handlers
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion || correctOption === null) {
      toast.error("Please enter the question and select a correct answer.");
      return;
    }
    const newQuestion = {
      desc: currentQuestion,
      options: [...currentOptions],
      answer:correctOption,
      points,
      difficulty, // Add difficulty here
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion("");
    setCurrentOptions(Array(numOptions).fill(""));
    setCorrectOption(null);
    setpoints(); // Reset points
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBankQuestions([]);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleQuestionSelect = (question) => {
    
    if (selectedBankQuestions.some((q) => q.questionId === question.questionId)) {
      // If question is already selected, deselect it
      setSelectedBankQuestions(prev => prev.filter((q) => q.questionId !== question.questionId));
    } else {
      // If not selected, add it to the selection
      setSelectedBankQuestions(prev => [...prev, question]);
    }
  };

  const handleAddSelectedQuestions = () => {
    setQuestions([...questions, ...selectedBankQuestions]);
    handleCloseModal();
  };

  const mergeDateAndTimeIST = (date, time) => {

    // Combine the date and time strings
    const dateTimeString = `${date}T${time}:00`;

    // Create a new Date object from the combined string
    const mergedDate = new Date(dateTimeString);

    if (isNaN(mergedDate)) {
        toast.error("Invalid date or time format.");
    }

    const istDate = new Date(mergedDate.getTime());

    return istDate;
};

  const handleSubmitExam = async () => {
    if (examTitle && subject && program && semester && questions.length) {
      const examData = {
        title:examTitle,
        subject,
        batch:"2022",
        branch:program,
        duration,
        semester,
        startTime:mergeDateAndTimeIST(date, startTime),
        questions,
        total_points: totalmarks,
        difficulty,
        instructions,
        examType: 1,
        status: "Published"
      };

    //   console.log(examData);
      
      setisloaderon(true);
      try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
        };

        const result = await axios.post(
            (config.BACKEND_API || "http://localhost:8000") +
                "/create-exam",
                examData,
            { headers }
        );

        // console.log(result);

        if (result.status !== 200) {
            toast.error(result.data.message);
            return;
        }

        toast.success(result.data.message);
        onClose();
        fetchAgain();

        // Reset all fields
        settotalmarks("");
        setExamTitle("");
        setSubject("");
        setProgram("");
        setSemester("");
        setDuration("");
        setDate("");
        setStartTime("");
        setInstructions(""); // Reset instructions
        setQuestions([]);
        setStep(1);
    } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message || "Internal server error");
    }
    } else {
      toast.error("Please complete all fields and add at least one question.");
    }
    setisloaderon(false);
  };
  
  useEffect(() => {
    setFilteredQuestions(questionBank.filter((q) =>
        q.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [questionBank]);

  useEffect(() => {
    const sum = questions.reduce((acc, question) => acc + question.points, 0);
    settotalmarks(sum);
  }, [questions]);

  return (
    <div className="create-exam-container">
    {isloaderon && <Loading/>}
      <div className="create-exam-form">
        {step === 1 && (
          <div className="step-one">
            <h2>Step 1: Basic Details</h2>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              placeholder="Exam Title"
            />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
            <input
              type="text"
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              placeholder="Program"
            />
            <input
              type="text"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              placeholder="Semester"
            />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Enter instructions for the exam"
              rows="4"
              cols="50"
            ></textarea>
            <button onClick={handleNext}>Next</button>
          </div>
        )}

{step === 2 && (
          <div className="step-two">
            <h2>Step 2: Timing Details</h2>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (in minutes)"
              min="1"
              step="1"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleNext}>Next</button>
          </div>
        )}


        {step === 3 && (
          <div className="step-three">
            <h2>Step 3: Add Questions</h2>
            <input
              type="text"
              value={currentQuestion}
              onChange={(e) => setCurrentQuestion(e.target.value)}
              placeholder="Question Text"
            />
            <input
              type="number"
              value={points}
              onChange={(e) => setpoints(parseInt(e.target.value) || 0)}
              placeholder="Points"
            />

            <input
              type="number"
              value={numOptions}
              onChange={(e) =>
                setNumOptions(Math.max(2, parseInt(e.target.value) || 4))
              }
              placeholder="Number of Options"
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
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
                    className="option-input-option"
                    type="text"
                    value={currentOptions[index] || ""}
                    onChange={(e) =>
                      setCurrentOptions((prevOptions) =>
                        prevOptions.map((opt, i) => (i === index ? e.target.value : opt))
                      )
                    }
                    placeholder={`Option ${index + 1}`}
                  />
                </div>
              ))}
            </div>

            <button className="create-exam-btn1" onClick={handleAddQuestion}>Add Question</button>
            <button className="create-exam-btn1" onClick={handleOpenModal}>Add from Question Bank</button>
            <button className="create-exam-btn1" onClick={handlePrevious}>Previous</button>
            <button className="create-exam-btn1" onClick={handleSubmitExam}>Submit Exam</button>
          </div>
        )}
      </div>

      {/* Exam Preview */}
      <div className="exam-preview">
        <h3>Exam Preview</h3>
        <div className="exam-preview-container">
          <p><strong>Title:</strong> {examTitle}</p>
          <p><strong>Subject:</strong> {subject}</p>
          <p><strong>Program:</strong> {program}</p>
          <p><strong>Semester:</strong> {semester}</p>
          <p><strong>Duration:</strong> {duration}</p>
          <p><strong>Date:</strong> {date}</p>
          <p><strong>Start Time:</strong> {startTime}</p>
          <p><strong>Instructions:</strong> {instructions}</p>
          <p><strong>Total Marks:</strong> {totalmarks}</p>


          <h4>Questions:</h4>
          {questions.map((q, index) => (
            <div key={index} className="question-preview">
              <p>
                Q{index + 1}: {q.desc} (Points: {q.points} Difficulty: {q.difficulty})
                <button className="exam-preview-deletebtn" onClick={() => handleDeleteQuestion(index)}>Delete</button>
              </p>
              <ul>

                {q.options.map((option, i) => (
                  <li
                    key={i}
                    className={q.correctOption === i ? "correct-option" : ""}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Modal for Question Bank */}
        {isModalOpen && (
          <div className="modal">
            <div className="modal-content">
              <h2>Question Bank</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search questions..."
              />

              <div className="question-bank">
                {filteredQuestions.map((question) => {

                  return (
                    <label key={question.questionId} className="question-item">
                      <input
                        className="question-item-input"
                        type="checkbox"
                        checked={selectedBankQuestions.some((q) => q.questionId === question.questionId)}
                        onChange={() => {handleQuestionSelect(question);
                        }}
                      />
                      <span>{question.desc}</span>
                    </label>
                  );
                })}

              </div>

              <button onClick={handleAddSelectedQuestions}>Add Selected Questions</button>
              <button onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateExam;
