import React, { useState, useEffect } from "react";
import "./updateexam.css";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import axios from "axios";
import config from "../../config.js";
import { useNavigate } from "react-router-dom";
import Loading from "../Loader/Loding.jsx"


const UpdateExam = ({ onClose, toast, examId, fetchAgain }) => {
  const [exam, setExam] = useState({});

  const [totalMarks, setTotalMarks] = useState(0);
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [showQuestions, setShowQuestions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCancelExamModal, setShowCancelExamModal] = useState(false);
  const [Isclosepage, setIsclosepage] = useState(false);
  const navigate = useNavigate();
  const [isloaderon, setisloaderon] = useState(false);



  useEffect(() => {
    if(!Cookies.get("token")){
        navigate("/");
    }else{
        fetch_exam();
    }
  }, []);

  const fetch_exam = async () => {
    setisloaderon(true);

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
        };

        const result = await axios.get(
            (config.BACKEND_API || "http://localhost:8000") +
                `/fetch-exam-examiner/${examId}`,
            { headers }
        );

        // console.log(result);

        if (result.status !== 200) {
            toast.error(result.data.message);
            return;
        }

        result.data.exam.questions.map((_, index) => {
            result.data.exam.questions[index].id = index + 1;
        });

        setExam(result.data.exam);
    } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message || "Internal server error");
    }
    setisloaderon(false);

};

const delete_exam = async () => {
  setisloaderon(true);

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
        };

        const result = await axios.delete(
            (config.BACKEND_API || "http://localhost:8000") +
                `/delete-exam/${examId}`,
            { headers }
        );

        // console.log(result);

        if (result.status !== 200) {
            toast.error(result.data.message);
            return;
        }

        toast.success(result.data.message);

        fetchAgain();
        onClose();
    } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message || "Internal server error");
    }
    setisloaderon(false);

};

  // Function to calculate total marks
  const calculateTotalMarks = () => {
    if(exam?.questions){
        const sum = exam.questions.reduce((acc, question) => acc + question.points, 0);
        setTotalMarks(sum);
    }
    
  };

  // Recalculate total marks whenever questions array changes
  useEffect(() => {
    calculateTotalMarks();
  }, [exam]);

  const validateDateTime = () => {
    const currentDate = new Date();
    const selectedDateTime = new Date(`${exam.date}T${exam.time}`);
    if (selectedDateTime <= currentDate) {
      alert("Please select a valid date and time in the future.");
      return false;
    }
    return true;
  };

  const saveExamDetails = async () => {
    setisloaderon(true);

    try {
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${Cookies.get("token")}`,
        };

        const result = await axios.put(
            (config.BACKEND_API || "http://localhost:8000") +
                `/update-exam/${examId}`,
                exam,
            { headers }
        );

        // console.log(result);

        if (result.status !== 200) {
            toast.error(result.data.message);
            return;
        }

        toast.success(result.data.message);

        fetchAgain();
        onClose();
    } catch (e) {
        console.log(e);
        toast.error(e?.response?.data?.message || "Internal server error");
    }
    setisloaderon(false);

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
        { ...selectedQuestion, id: prevExam.questions.length + 1},
      ],
    }));
    setShowModal(false);
    setSelectedQuestion(null);
  };

  const handleDeleteQuestion = (id) => {
    const questionToDelete = exam.questions.find((q) => q.id === id);
    if (
      window.confirm(
        `Do you want to delete the question: "${questionToDelete.desc}"?`
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

  const confirmCancelExam = async () => {
    setisloaderon(true);

    try{
        await delete_exam();

        setShowCancelExamModal(false);
        setExam(null);
    }catch(e){
        console.log(e);
        toast.error(e?.response?.data?.message || "Internal server error");
    }
    setisloaderon(false);

  };

  const addNewQuestion = () => {
    setSelectedQuestion({
      desc: "",
      options: ["Option 1", "Option 2"],
      answer: 0,
      points: 1,
      difficulty: "Easy",
    });
    setShowModal(true);
  };

  const convertUTCToIST = (datetime) => {

    const utcDate = new Date(datetime);

    const istDate = new Date(utcDate.getTime());

    // Format "yyyy-MM-dd"
    const yyyy = istDate.getFullYear();
    const mm = String(istDate.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const dd = String(istDate.getDate()).padStart(2, '0');
    const formattedDate = `${yyyy}-${mm}-${dd}`;

    // Format "hh:mm:ss AM/PM"
    const hours = String(istDate.getHours()).padStart(2, '0');
    const minutes = String(istDate.getMinutes()).padStart(2, '0');
    const seconds = String(istDate.getSeconds()).padStart(2, '0');

    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return {
        date: formattedDate,
        time: formattedTime,
    };
};



  return (
    <div className="update-exam-div">
    {isloaderon && <Loading/>}
    <div className="update-exam-container">
      <h1>Update Exam</h1>

      <div className="exam-details">
        <label>
          Exam Name:
          <input
            type="text"
            name="name"
            value={exam?.title}
            onChange={(e) => setExam({ ...exam, name: e.target.value })}
          />
        </label>

        <label>
          Exam Duration (minutes):
          <input
            type="number"
            name="duration"
            value={exam?.duration}
            onChange={(e) => setExam({ ...exam, duration: e.target.value })}
          />
        </label>

        <label>
          Exam Date:
          <input
            type="date"
            name="date"
            value={convertUTCToIST(exam?.startTime).date}
            onChange={(e) => setExam({ ...exam, date: e.target.value })}
          />
        </label>

        <label>
          Exam Time:
          <input
            type="time"
            name="time"
            value={convertUTCToIST(exam?.startTime).time}
            onChange={(e) => setExam({ ...exam, time: e.target.value })}
          />
        </label>

        <label>
          Total Marks: <b>{totalMarks}</b>
        </label>

        <label>
          Subject:
          <textarea
            name="subject"
            value={exam?.subject}
            onChange={(e) => setExam({ ...exam, subject: e.target.value })}
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
              {exam?.questions && exam.questions.map((question, index) => (
                <li key={index}>
                  <div className="question-item">
                    <span>{question?.desc}</span>
                    <button
                      className="update-btn"
                      onClick={() => handleQuestionSelect(question?.id)}
                    >
                      Update
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteQuestion(question?.id)}
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
                value={selectedQuestion.desc}
                onChange={(e) => handleQuestionUpdate("desc", e.target.value)}
              />
            </label>

            <label>Options:</label>
            <div className="options-container">
              {selectedQuestion?.options && selectedQuestion.options.map((option, index) => (
                <div key={index} className="option-item">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionUpdate(index, e.target.value)}
                  />
                  <input
                    type="radio"
                    name="answer"
                    checked={selectedQuestion.answer === index}
                    onChange={() =>
                      handleQuestionUpdate("answer", index)
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
                value={selectedQuestion.points}
                onChange={(e) =>
                  handleQuestionUpdate("points", parseInt(e.target.value, 10))
                }
              />
            </label>
            <label>
              Difficulty:
              <select
                type="String"
                value={selectedQuestion.difficulty}
                onChange={(e) =>
                  handleQuestionUpdate("difficulty", e.target.value)
                }
              >
              <option value="Easy" selected> Easy </option>
              <option value="Medium"> Medium </option>
              <option value="Hard"> Hard </option>
                </select>
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