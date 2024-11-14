import React, { useState } from 'react';
import './CreateStudent.css';

const CreateStudent = ({onClose}) => {
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    firstName: '',
    surname: '',
    fatherName: '',
    dob: '',
    email: '',
    contact: '',
    admissionYear: currentYear,
    studentType: '', // UG or PG
    gender: '', // Male or Female
    role: '', // ICT, CS, MNC
  });

  // Update form data on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Validate form data and submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const contactRegex = /^\d{10}$/;

    if (!contactRegex.test(formData.contact)) {
      alert('Contact number must be 10 digits');
      return;
    }
    if (!formData.studentType) {
      alert('Please select your graduation type (UG or PG)');
      return;
    }
    console.log('Student data submitted: ', formData);
  };

  // Reset form data
  const handleClose = () => {
    setFormData({
      firstName: '',
      surname: '',
      fatherName: '',
      dob: '',
      email: '',
      contact: '',
      admissionYear: '',
      studentType: '',
      gender: '',
      role: '',
    });
    console.log('Form closed or reset');
  };

  return (
    <div className="create-student-container">
      <h2 className="createstudentheader">Create Student</h2>
      <form onSubmit={handleSubmit} className="student-form">
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
            <label htmlFor="fatherName">Middle Name:</label>
            <input
              type="text"
              id="fatherName"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Enter father's name"
              required
            />
          </div>
          <div className="half-width">
            <label htmlFor="dob">Date of Birth:</label>
            <br />
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
              pattern="\d{10}"
              title="Contact number must be 10 digits"
            />
          </div>
        </div>

        <div className="form-group">
          <div className="half-width">
            <label htmlFor="admissionYear">Admission Year:</label>
            <input
              type="number"
              id="admissionYear"
              name="admissionYear"
              value={formData.admissionYear}
              onChange={handleChange}
              placeholder="Enter admission year"
              required
            />
          </div>
          <div className="select-branch">
            <label htmlFor="role">Branch:</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              aria-label="Select Role"
            >
              <option value="Ict">Information and Communication Technology</option>
              <option value="Cs">Computer Science</option>
              <option value="Mnc">Mathematics and Computation</option>
            </select>
          </div>
        </div>

        <div className="form-group">
        <div className="radio-group">
              <label>Gender:</label>
              <div className='radio-group-div'>
                <input
                  type="radio"
                  name="gender"
                  value="Male"
                  checked={formData.gender === 'Male'}
                  onChange={handleChange}
                  required
                />
                Male
                <input
                  type="radio"
                  name="gender"
                  value="Female"
                  checked={formData.gender === 'Female'}
                  onChange={handleChange}
                  required
                />
                Female
              </div>
            </div>
        <div className="radio-group">
          <label>Graduation:</label>
              <div className='radio-group-div'>
                <input
                  type="radio"
                  name="Graduation"
                  value="UG"
                  checked={formData.gender === 'UG'}
                  onChange={handleChange}
                  required
                />
                UG
                <input
                  type="radio"
                  name="Graduation"
                  value="PG"
                  checked={formData.gender === 'PG'}
                  onChange={handleChange}
                  required
                />
                PG
              </div>
          </div>
        </div>

        <button type="submit" className="submit-btn">Create Student</button>
        <button type="button" onClick={onClose} className="close-btn">Close</button>
      </form>
    </div>
  );
};

export default CreateStudent;
