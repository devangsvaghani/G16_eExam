// OverallPerformance.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const OverallPerformance = ({ pastExams }) => {
  const [averageScore, setAverageScore] = useState(0);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    if (pastExams.length > 0) {
      // Calculate the average score
      const totalScore = pastExams.reduce((acc, exam) => acc + exam.score, 0);
      const avgScore = totalScore / pastExams.length;
      setAverageScore(avgScore);

      // Prepare data for chart
      const chartData = pastExams.map((exam, index) => ({
        name: `Exam ${index + 1}`,
        score: exam.score,
        average: avgScore,
      }));
      setPerformanceData(chartData);
    }
  }, [pastExams]);

  return (
    <div>
      <h2>Overall Performance</h2>
      <p>Average Score: {averageScore.toFixed(2)}</p>
      <ResponsiveContainer width="100%" height={400}>
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
    </div>
  );
};

export default OverallPerformance;
