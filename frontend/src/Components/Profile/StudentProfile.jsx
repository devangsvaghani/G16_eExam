import React, { useState, useEffect } from 'react';
import './StudentProfile.css';
import defaultProfilePic from '../assets/default-profile.jpg';

function StudentProfile() {
  const [userData, setUserData] = useState({
    studentId: '',          // Changed "examinerId" back to "studentId"
    mobileNumber: '',
    addressLine1: '',
    postcode: '',
    state: '',
    stream: '',             // Changed "education" to "stream"
    country: '',
    dateOfBirth: '',
    firstName: '',
    surname: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  // Fetch user data from the API
  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-data'); // Replace with your actual API endpoint
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setLoading(false);
      } else {
        console.error('Failed to fetch user data');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  // Save user data to the API
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/save-profile', {  // Replace with your actual API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
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
    fetchUserData();  // Fetch user data from the API
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <div className="profile-card">
        <div className="content">
          <h2>Profile Settings</h2>
          <form className="profile-form">
            <div className="form-group">
              <label>Student ID</label>  {/* Updated label to "Student ID" */}
              <input type="text" value={userData.studentId} readOnly />
            </div>
            <div className="form-group">
              <label>Mobile Number</label>
              <input
                type="text"
                placeholder="Enter phone number"
                value={userData.mobileNumber}
                onChange={(e) => setUserData({ ...userData, mobileNumber: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="Enter address"
                value={userData.addressLine1}
                onChange={(e) => setUserData({ ...userData, addressLine1: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Postcode</label>
              <input
                type="text"
                placeholder="Enter postcode"
                value={userData.postcode}
                onChange={(e) => setUserData({ ...userData, postcode: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                placeholder="Enter state"
                value={userData.state}
                onChange={(e) => setUserData({ ...userData, state: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Stream</label>   {/* Updated label to "Stream" */}
              <input
                type="text"
                placeholder="Enter your stream"
                value={userData.stream}  // Updated property to "stream"
                onChange={(e) => setUserData({ ...userData, stream: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                placeholder="Country"
                value={userData.country}
                onChange={(e) => setUserData({ ...userData, country: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Date of Birth</label>
              <input
                type="date"
                placeholder="Date of Birth"
                value={userData.dateOfBirth}
                onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
              />
            </div>
          </form>
        </div>

        {/* Sidebar with Profile Image, Info, and Save Button */}
        <div className="sbar">
          <img src={defaultProfilePic} alt="Profile" className="profile-pic" />
          <h3 className="profile-name">{userData.firstName} {userData.surname}</h3>
          <p className="profile-email">{userData.email}</p>
          <button type="button" className="save-button" onClick={handleSaveProfile}>Save Profile</button>
        </div>
      </div>
  );
}

export default StudentProfile;
