import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';
import './PerformanceResultPage.css';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57'];

const OverallPerformance = ({ pastExams }) => {
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

  return (
    <div className="overall-performance">
      <h2>Overall Performance</h2>
      <p>Average Score: {averageScore.toFixed(2)}</p>
      <div className="charts-container">
        <ResponsiveContainer width="60%" height={400}>
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
        <ResponsiveContainer width="40%" height={400}>
          <PieChart>
            <Pie
              data={[{ name: 'Final Percentage', value: finalPercentage }]}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={150}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
            >
              <Cell fill="#8884d8" />
            </Pie>
            <Label
              value={`Final Percentage: ${finalPercentage.toFixed(2)}%`}
              position="center"
              style={{ fontSize: '18px', fontWeight: 'bold' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const ResultPage = () => {
  const [results, setResults] = useState([
    { exam: 'Exam 1', score: 80 },
    { exam: 'Exam 2', score: 75 },
    { exam: 'Exam 3', score: 90 },
    { exam: 'Exam 4', score: 85 },
    { exam: 'Exam 5', score: 78 },
    { exam: 'Exam 6', score: 88 },
  ]);

  return (
    <div className="result-page">
      <div className="exam-result">
        <h3>Exam Result</h3>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.exam}</td>
                  <td>{result.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PerformanceResultPage = ({ pastExams }) => {
  return (
    <div>
      <OverallPerformance pastExams={pastExams} />
      <ResultPage />
    </div>
  );
};

export default PerformanceResultPage;
