import React, { useState } from "react";
import "./ExamResults.css";
import Examreport from '../ResultPage/Examreport.jsx'

// Sample student data
const studentData = [
  { id: "202201242", name: "John Doe", marksEarned: 85,  batch: "2024" },
  { id: "202201247", name: "Jane Smith", marksEarned: 90, batch: "2024" },
  { id: "202201241", name: "Alice Brown", marksEarned: 78, batch: "2023" },
  { id: "202201243", name: "Bob Johnson", marksEarned: 88, batch: "2023" },
  { id: "202201244", name: "John Doe", marksEarned: 85,  batch: "2024" },
  
];

const ExamResult = ({examtitle,subject,duration,starttime,numquestion,totalmarks}) => {
  const [searchTerm, setSearchTerm] = useState("");
  // Filter students by ID
  const filteredStudents = studentData.filter((student) =>
    student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [isExamreportopen,setisExamreportopen] = useState(false);
  
  return (
    <div className="exam-result-container">
      { !isExamreportopen &&
      <>
      <h2>Exam Results</h2>
      <div className="exam-information-div">
        <h3> Exam Title : <span>{examtitle}</span></h3>
        <h3> Subject : <span>{subject}</span></h3> 
        <h3>Duration : <span>{duration}</span></h3>
        <h3>Starttime : <span>{starttime}</span></h3>
        <h3>No. of Question: <span>{numquestion}</span></h3>
        <h3>Total Marks :<span>{totalmarks}</span></h3>
      </div>
      <input
        type="text"
        placeholder="Search by Student ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
      <table className="exam-result-table">
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Marks Earned</th>
            {/* <th>Total Marks</th> */}
            <th>Batch</th>
          </tr>
        </thead>
        <tbody className="table-content" >
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id} >
                <td onClick={()=> setisExamreportopen(true)} className="studentid-result"
                onclick>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.marksEarned}</td>
                {/* <td>{student.totalMarks}</td> */}
                <td>{student.batch}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">
                No results found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      </>
      }
      {isExamreportopen && 
        <>
      <Examreport/>
      <button className="create-examiner-button" style={{zIndex:"10"}} onClick={()=>setisExamreportopen(false)}>
              Close
      </button>
      </>
      }
    </div>
  );
};

export default ExamResult;
