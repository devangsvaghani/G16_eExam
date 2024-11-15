import React, { useState ,useEffect} from "react";
import "./CreateExam.css";

const CreateExam = () => {
  const [step, setStep] = useState(1);

  // Step 1: Basic Details
  const [examTitle, setExamTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [degree, setDegree] = useState("B.Tech");
  const [program, setProgram] = useState("");
  const [semester, setSemester] = useState("");

  // Step 2: Timing Details
  const [duration, setDuration] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");

  // Step 3: Questions
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [numOptions, setNumOptions] = useState(4);
  const [correctOption, setCorrectOption] = useState(null);



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

  // Sample Question Bank
  const questionBank = [
    { id: 1, questionText: "What is React?", options: ["Library", "Framework", "Language", "Tool"], correctOption: 0 },
    { id: 2, questionText: "What is JSX?", options: ["Syntax", "Style", "Library", "API"], correctOption: 0 },
    { id: 3, questionText: "What is useState?", options: ["Hook", "Function", "Class", "Event"], correctOption: 0 },
    // Additional questions can be added here
  ];

  // Handlers
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleAddQuestion = () => {
    if (!currentQuestion || correctOption === null) {
      alert("Please enter the question and select a correct answer.");
      return;
    }
    const newQuestion = {
      questionText: currentQuestion,
      options: [...currentOptions],
      correctOption,
    };
    setQuestions([...questions, newQuestion]);
    setCurrentQuestion("");
    setCurrentOptions(Array(numOptions).fill(""));
    setCorrectOption(null);
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
    if (selectedBankQuestions.some((q) => q.id === question.id)) {
      // If question is already selected, deselect it
      setSelectedBankQuestions(selectedBankQuestions.filter((q) => q.id !== question.id));
    } else {
      // If not selected, add it to the selection
      setSelectedBankQuestions([...selectedBankQuestions, question]);
    }
  };
  

  const handleAddSelectedQuestions = () => {
    setQuestions([...questions, ...selectedBankQuestions]);
    handleCloseModal();
  };

  const handleSubmitExam = () => {
    if (examTitle && subject && program && semester && questions.length) {
      const examData = {
        examTitle,
        subject,
        degree,
        program,
        semester,
        duration,
        date,
        startTime,
        questions,
      };
      console.log("Exam Created:", examData);
      alert("Exam created successfully!");
      // Reset all fields
      setExamTitle("");
      setSubject("");
      setProgram("");
      setSemester("");
      setDuration("");
      setDate("");
      setStartTime("");
      setQuestions([]);
      setStep(1);
    } else {
      alert("Please complete all fields and add at least one question.");
    }
  };

  // Filtered Question Bank for Search
  const filteredQuestions = questionBank.filter((q) =>
    q.questionText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="create-exam-container">
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
            <button onClick={handleNext}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className="step-two">
            <h2>Step 2: Timing Details</h2>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (e.g., 2 hours)"
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
              value={numOptions}
              onChange={(e) =>
                setNumOptions(Math.max(2, parseInt(e.target.value) || 4))
              }
              placeholder="Number of Options"
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

            <button onClick={handleAddQuestion}>Add Question</button>
            <button onClick={handleOpenModal}>Add from Question Bank</button>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleSubmitExam}>Submit Exam</button>
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
        
        <h4>Questions:</h4>
        {questions.map((q, index) => (
          <div key={index} className="question-preview">
            <p>
              Q{index + 1}: {q.questionText}
              <button className="exam-preview-deletebtn"onClick={() => handleDeleteQuestion(index)}>Delete</button>
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
                const isSelected = selectedBankQuestions.some((q) => q.id === question.id);

                return (
                  <label key={question.id} className="question-item">
                    <input
                      className="question-item-input"
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleQuestionSelect(question)}
                    />
                    <span>{question.questionText}</span>
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
