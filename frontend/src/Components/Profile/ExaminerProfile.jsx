import React, { useState, useEffect } from 'react';
import './ExaminerProfile.css';
import defaultProfilePic from '../assets/default-profile.jpg';

function ExaminerProfile() {
  const [examinerData, setExaminerData] = useState({
    examinerId: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    department: '',
    yearsOfExperience: '',
    education: '',
    certifications: '',
    dateOfBirth: '',
    assignedSubjects: '',
    languages: '',
    availability: ''
  });
  const [loading, setLoading] = useState(true);

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

  // Save examiner data to the API
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/save-examiner-profile', {  // Replace with your actual API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(examinerData),
      });
      if (response.ok) {
        alert('Profile saved successfully!');
      } else {
        alert('Failed to save profile. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while saving the profile. Please try again.');
      console.error('Error saving profile:', error);
    }
  };

  useEffect(() => {
    fetchExaminerData();  // Fetch examiner data from the API
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="profile-card">
        <div className="content">
          <h2>Examiner Profile</h2>
          <form className="profile-form">
            <div className="form-group">
              <label>Examiner ID</label>
              <input type="text" value={examinerData.examinerId} readOnly />
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter full name"
                value={examinerData.fullName}
                onChange={(e) => setExaminerData({ ...examinerData, fullName: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter email"
                value={examinerData.email}
                onChange={(e) => setExaminerData({ ...examinerData, email: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={examinerData.phoneNumber}
                onChange={(e) => setExaminerData({ ...examinerData, phoneNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={examinerData.address}
                onChange={(e) => setExaminerData({ ...examinerData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={examinerData.city}
                onChange={(e) => setExaminerData({ ...examinerData, city: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                placeholder="Enter state"
                value={examinerData.state}
                onChange={(e) => setExaminerData({ ...examinerData, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                placeholder="Enter country"
                value={examinerData.country}
                onChange={(e) => setExaminerData({ ...examinerData, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Department</label>
              <input
                type="text"
                placeholder="Enter department"
                value={examinerData.department}
                onChange={(e) => setExaminerData({ ...examinerData, department: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="text"
                placeholder="Enter years of experience"
                value={examinerData.yearsOfExperience}
                onChange={(e) => setExaminerData({ ...examinerData, yearsOfExperience: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                placeholder="Enter education details"
                value={examinerData.education}
                onChange={(e) => setExaminerData({ ...examinerData, education: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Certifications</label>
              <input
                type="text"
                placeholder="Enter certifications"
                value={examinerData.certifications}
                onChange={(e) => setExaminerData({ ...examinerData, certifications: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Assigned Subjects</label>
              <input
                type="text"
                placeholder="Enter assigned subjects"
                value={examinerData.assignedSubjects}
                onChange={(e) => setExaminerData({ ...examinerData, assignedSubjects: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Languages</label>
              <input
                type="text"
                placeholder="Enter languages"
                value={examinerData.languages}
                onChange={(e) => setExaminerData({ ...examinerData, languages: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Availability</label>
              <input
                type="text"
                placeholder="Enter availability"
                value={examinerData.availability}
                onChange={(e) => setExaminerData({ ...examinerData, availability: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Sidebar with Profile Image, Info, and Save Button */}
        <div className="sbar">
          <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
          <h3 className="profile-name">{examinerData.fullName}</h3>
          <p className="profile-email">{examinerData.email}</p>
          <button type="button" className="save-button" onClick={handleSaveProfile}>Save Profile</button>
        </div>
      </div>
  );
}

export default ExaminerProfile;
