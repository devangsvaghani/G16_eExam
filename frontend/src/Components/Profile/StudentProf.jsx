import React, { useState, useEffect } from 'react';
import './StudentProf.css';
import user from '../assets/user.png';
import { useNavigate } from 'react-router-dom';

function StudentProf() {
  const [userData, setUserData] = useState({
    studentId: '',
    mobileNumber: '',
    addressLine1: '',
    postcode: '',
    state: '',
    stream: '',
    country: '',
    dateOfBirth: '',
    firstName: '',
    surname: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // New state to check if user is an admin
  const navigate = useNavigate();

  const handleresetpass = () => {
    navigate('/resetpass');
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-data');
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsAdmin(data.role === 'admin'); // Assuming the user role comes in the data as `role`
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

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/save-profile', {
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
    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='studentpdiv'>
      <div id='profilecontainer'>
        <div id="profile-card">
          <div id="content">
            <h2>Profile Settings</h2>
            <form id="profile-form">
              <div id="form-group">
                <label>Student ID</label>
                <input type="text" value={userData.studentId} readOnly />
              </div>
              <div id="form-group">
                <label>Mobile Number</label>
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={userData.mobileNumber}
                  onChange={(e) => setUserData({ ...userData, mobileNumber: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={userData.addressLine1}
                  onChange={(e) => setUserData({ ...userData, addressLine1: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>Postcode</label>
                <input
                  type="text"
                  placeholder="Enter postcode"
                  value={userData.postcode}
                  onChange={(e) => setUserData({ ...userData, postcode: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={userData.state}
                  onChange={(e) => setUserData({ ...userData, state: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>Stream</label>
                <input
                  type="text"
                  placeholder="Enter your stream"
                  value={userData.stream}
                  onChange={(e) => setUserData({ ...userData, stream: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>Country</label>
                <input
                  type="text"
                  placeholder="Country"
                  value={userData.country}
                  onChange={(e) => setUserData({ ...userData, country: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
              <div id="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  placeholder="Date of Birth"
                  value={userData.dateOfBirth}
                  onChange={(e) => setUserData({ ...userData, dateOfBirth: e.target.value })}
                  readOnly={!isAdmin}
                />
              </div>
            </form>
          </div>

          {/* Sidebar with Profile Image, Info, Reset Password Button, and Edit Profile (only for Admins) */}
          <div id="sbar">
            <img src={user} alt="Profile" id="profile-pic" />
            <h3 id="profile-name">{userData.firstName} {userData.surname}</h3>
            <p id="profile-email">{userData.email}</p>
            <button type="button" id="reset-button" onClick={handleresetpass}>Reset Password</button>
            {isAdmin && ( // Only render the "Edit Profile" button if the user is an admin
              <button type="button" id="save-button" onClick={handleSaveProfile}>Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentProf;
