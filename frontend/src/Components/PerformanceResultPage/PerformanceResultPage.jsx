import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import Examreport from '../ResultPage/Examreport'
import './PerformanceResultPage.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57'];

const PerformanceResultPage = ({ pastExams }) => {
  const [averageScore, setAverageScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);
  const [finalPercentage, setFinalPercentage] = useState(0);

  useEffect(() => {
    if (pastExams.length > 0) {
      const totalScore = pastExams.reduce((acc, exam) => acc + exam.score, 0);
      const avgScore = totalScore / pastExams.length;
      setAverageScore(avgScore);

      // Calculate final percentage based on the total score
      const maxScore = pastExams.length * 100; // Assuming each exam is out of 100
      const percentage = (totalScore / maxScore) * 100;
      setFinalPercentage(percentage);

      const chartData = pastExams.map((exam, index) => ({
        name: `Exam ${index + 1}`,
        score: exam.score,
        average: avgScore,
      }));
      setPerformanceData(chartData);
    }
  }, [pastExams]);

  const [isexamreportopen,setisexamreportopen] = useState(false);
  const [results, setResults] = useState([
    { exam: 'Exam 1', score: 80 ,total : 100 },
    { exam: 'Exam 2', score: 75 ,total : 100 },
    { exam: 'Exam 3', score: 90 ,total : 100 },
    { exam: 'Exam 4', score: 85 ,total : 100 },
    { exam: 'Exam 5', score: 78 ,total : 100 },
    { exam: 'Exam 6', score: 88 ,total : 100 },
    { exam: 'Exam 1', score: 80 ,total : 100 },
    { exam: 'Exam 2', score: 75 ,total : 100 },
    { exam: 'Exam 3', score: 90 ,total : 100 },
    { exam: 'Exam 4', score: 85 ,total : 100 },
    { exam: 'Exam 5', score: 78 ,total : 100 },
    { exam: 'Exam 6', score: 88 ,total : 100 },
    { exam: 'Exam 1', score: 80 ,total : 100 },
    { exam: 'Exam 2', score: 75 ,total : 100 },
    { exam: 'Exam 3', score: 90 ,total : 100 },
    { exam: 'Exam 4', score: 85 ,total : 100 },
    { exam: 'Exam 5', score: 78 ,total : 100 },
    { exam: 'Exam 6', score: 88 ,total : 100 },
    { exam: 'Exam 1', score: 80 ,total : 100 },
    { exam: 'Exam 2', score: 75 ,total : 100 },
    { exam: 'Exam 3', score: 90 ,total : 100 },
    { exam: 'Exam 4', score: 85 ,total : 100 },
    { exam: 'Exam 5', score: 78 ,total : 100 },
    { exam: 'Exam 6', score: 88 ,total : 100 },
  ]);

  return (
    <div>
      {!isexamreportopen &&
      <div>
      <div className="overall-performance">
      <h2>Overall Performance</h2>
      <p>Average Score: {averageScore.toFixed(2)}</p>
      <div className="charts-container">
        <ResponsiveContainer width="60%" height={300}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="score" stroke="#8884d8" name="Exam Score" />
            <Line type="monotone" dataKey="average" stroke="#82ca9d" name="Average Score" />
          </LineChart>
        </ResponsiveContainer>
        <div className="chart-container-progress-circle">
        <div style={{
                      width: '200px',
                      height: '200px',
                      borderRadius: '50%',
                      background: 'conic-gradient(#3F72AF 0% 53%, #e0e0e0 53%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
                    <div style={{
                      width: '150px',
                      height: '150px',
                      borderRadius: '50%',
                      background: 'conic-gradient(white 0% 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}>
          <span>53%</span>
          </div>
          </div>
          <br/>
          <p>Overall Performance</p>
        </div>
      </div>
    </div>
      <div className="result-page">
          <div className="exam-result">
            <h3 >Exam Result</h3>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Marks Obtained</th>
                    <th>Total Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => (
                    <tr key={index}>
                      <td className='student-dashboard-td' onClick={()=>setisexamreportopen(true)}>{result.exam}</td>
                      <td>{result.score}</td>
                      <td>{result.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>}
      {isexamreportopen && 
        <div>

        <Examreport/>
        <button className="create-examiner-button" onClick={() =>setisexamreportopen(false)}>
          Close 
        </button>
        </div>
      }
      
    </div>
  );
};

export default PerformanceResultPage;