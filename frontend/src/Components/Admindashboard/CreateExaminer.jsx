import React, { useState } from 'react';
import './CreateExaminer.css';

const CreateExaminer = () => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    middleName: '',
    dob: '',
    email: '',
    contact: '',
    hireYear: currentYear,
    role: '', // Examiner role
    gender: '', // Male or Female
    expertise: '', // Expertise area
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      // Regular expression to match exactly 10 digits
      const contactRegex = /^\d{10}$/;

      if (!contactRegex.test(formData.contact)) {
        alert('Contact number must be 10 digits');
        return; // Stop form submission if the contact number is invalid
      }
    
    console.log('Examiner data submitted: ', formData);
    
  };


  const handleClose = () => {
    setFormData({
      firstName: '',
      surname: '',
      middleName: '',
      dob: '',
      email: '',
      contact: '',
      hireYear: '',
      role: '',
      gender: '',
      expertise: '',
    });
    console.log('Form closed or reset');
  };

  return (
    <div className="create-examiner-container">
      <h2 className="createexaminerheader">Create Examiner Profile</h2>
      <form onSubmit={handleSubmit} className="examiner-form">
        <div className="form-group">
          <div className="half-width">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="half-width">
            <label htmlFor="surname">Last Name:</label>
            <input
              type="text"
              id="surname"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Enter surname"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="half-width">
            <label htmlFor="middleName">Middle Name:</label>
            <input
              type="text"
              id="middleName"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
              placeholder="Enter middle name"
              required
            />
          </div>
          <div className="half-width">
            <label htmlFor="dob">Date of Birth:</label>
            <input
              type="date"
              id="dob"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <div className="half-width">
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="half-width">
            <label htmlFor="contact">Contact Number:</label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter contact number"
              required
              pattern="\d{10}" // Ensures exactly 10 digits
              title="Contact number must be 10 digits"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="half-width">
            <label htmlFor="hireYear">Hire Year:</label>
            <input
              type="number"
              id="hireYear"
              name="hireYear"
              value={formData.hireYear}
              onChange={handleChange}
              placeholder="Enter hire year"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="half-width">
            <div className="radio-group">
              <label>Gender:</label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  required
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  required
                />
                Female
              </label>
            </div>
          </div>

        </div>

        <div className="form-group">
         
       
        </div>

        <button type="submit" className="submit-btn">Create Examiner Profile</button>
        <button type="button" onClick={handleClose} className="close-btn">Close</button>
      </form>
    </div>
  );
};

export default CreateExaminer;
