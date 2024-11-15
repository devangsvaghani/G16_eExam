import React, { useState, useEffect } from 'react';
import './ExaminerProfile.css';
import defaultProfilePic from '../assets/default-profile.jpg';
import { useNavigate } from 'react-router-dom';

function ExaminerProfile() {
  const [examinerData, setExaminerData] = useState({
    examinerId: '',
    examinerfirstname: '',
    examinersurname: '',
    examinermiddlename: '',
    examinerdob: '',
    examineremail :'',
    examinercontactnumber: '',
    examinerhireyear: '',
    examinergender: '',
    
  });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const onClose = () => {
    navigate('/');
  }
  // Fetch examiner data from the API
  const fetchExaminerData = async () => {
    try {
      const response = await fetch('/api/examiner-data'); // Replace with your actual API endpoint
      if (response.ok) {
        const data = await response.json();
        setExaminerData(data);
        setLoading(false);
      } else {
        console.error('Failed to fetch examiner data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching examiner data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExaminerData();  // Fetch examiner data from the API
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='profileoverlay'>
      <div className="profile-card">
        <div className="profilecontent">
          <h2>Examiner Profile</h2>
          <form className="profile-form">
            <div className="form-group">
              <label>Examiner ID</label>
              <input type="text" value={examinerData.examinerId} readOnly />
            </div>
            <div className="form-group">
              <label>First Name</label>
              <input type="text" value={examinerData.examinerfirstname} readOnly />

            </div>
            <div className="form-group">
              <label>Surname</label>
              <input type="text" value={examinerData.examinersurname} readOnly />

            </div>
            <div className="form-group">
              <label>Middle Name</label>
              <input type="text" value={examinerData.examinermiddlename} readOnly />

            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="text" value={examinerData.examineremail} readOnly />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" value={examinerData.examinerdob} readOnly  />
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" value={examinerData.examinercontactnumber} readOnly />
            </div>
            <div className="form-group">
              <label>Hire Year</label>
              <input type="number" value={examinerData.examinerhireyear} readOnly />
            </div>
            <div className="form-group">
              <label>Gender</label>
              <input type="text" value={examinerData.examinergender} readOnly />
            </div>
          
          </form>
        </div>

        {/* Sidebar with Profile Image, Info, and Save Button */}
        <div className="sbar">
          <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
          <h3 className="profile-name">{examinerData.fullName}</h3>
          <p className="profile-email">{examinerData.email}</p>
          <button type="button" className="examinerprofilebutton" onClick={onClose}>Close</button>
        </div>
        
      </div>
      </div>
  );
}

export default ExaminerProfile;
