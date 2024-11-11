import React, { useState } from 'react';
import './ResultPage.css';

const ResultPage = () => {
  const [semester, setSemester] = useState('');
  const [results, setResults] = useState([]);

  const handleSemesterChange = (event) => {
    setSemester(event.target.value);
    // Fetch results for the selected semester from the API or local state
    // For demonstration, using static data
    if (event.target.value === 'Semester 1') {
      setResults([
        { exam: 'Math', score: 85, grade: 'A' },
        { exam: 'English', score: 78, grade: 'B' },
        { exam: 'Science', score: 90, grade: 'A' }
      ]);
    } else if (event.target.value === 'Semester 2') {
      setResults([
        { exam: 'History', score: 88, grade: 'A' },
        { exam: 'Physics', score: 72, grade: 'B' },
        { exam: 'Chemistry', score: 94, grade: 'A+' }
      ]);
    }
  };

  // Calculate total score and percentage
  const calculateTotalAndPercentage = () => {
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    const percentage = (totalScore / (results.length * 100)) * 100;
    return { totalScore, percentage };
  };

  const { totalScore, percentage } = calculateTotalAndPercentage();

  return (
    <div className="result-page">
      <h2>Select Your Semester</h2>
      <select onChange={handleSemesterChange} value={semester}>
        <option value="">Select Semester</option>
        <option value="Semester 1">Semester 1</option>
        <option value="Semester 2">Semester 2</option>
      </select>

      {semester && (
        <div className="report-card">
          <h3>Report Card for {semester}</h3>
          <table>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index}>
                  <td>{result.exam}</td>
                  <td>{result.score}</td>
                  <td>{result.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="summary">
            <h4>Grand Total: {totalScore} / {results.length * 100}</h4>
            <h4>Percentage: {percentage.toFixed(2)}%</h4>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultPage;
