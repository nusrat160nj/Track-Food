import React, { useState } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = () => {
  const [employeeID, setEmployeeID] = useState('');  // State variable for employee ID
  const [employeeName, setEmployeeName] = useState('');  // State variable for employee name
  const [breakfast, setBreakfast] = useState(null);
  const [dinner, setDinner] = useState(null);
  const [date, setDate] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (breakfast === null || dinner === null || !date) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/responses', { 
        employeeID,  // Updated variable name
        employeeName,  // Updated variable name
        breakfast, 
        dinner, 
        submissionDate: new Date(date).toISOString() // Ensure date is in ISO format
      });
      console.log('Server response:', response.data);
      setSubmitted(true);
      setEmployeeID('');  // Clear employeeID field
      setEmployeeName('');  // Clear employeeName field
      setBreakfast(null);
      setDinner(null);
      setDate('');
      setError('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('There was an error recording the response!', error);
      setError('Error submitting the form. Please try again.');
    }
  };

  return (
    <section id="user-form" className="user-form-container">
      <form onSubmit={handleSubmit} className="user-form">
        <h2 className="form-title">Food Tracking Form</h2>
        <label className="form-label">
          Employee ID:
          <input
            type="text"
            value={employeeID}  // Updated variable name
            onChange={(e) => setEmployeeID(e.target.value)}  // Updated variable name
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Employee Name:
          <input
            type="text"
            value={employeeName}  // Updated variable name
            onChange={(e) => setEmployeeName(e.target.value)}  // Updated variable name
            required
            className="form-input"
          />
        </label>
        <label className="form-label">
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="form-input"
          />
        </label>
        <div className="options-container">
          <div className="options-group">
            <p>Had Breakfast:</p>
            <button
              type="button"
              className={`option-button ${breakfast === true ? 'selected' : ''}`}
              onClick={() => setBreakfast(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`option-button ${breakfast === false ? 'selected' : ''}`}
              onClick={() => setBreakfast(false)}
            >
              No
            </button>
          </div>
          <div className="options-group">
            <p>Would you like to have Dinner:</p>
            <button
              type="button"
              className={`option-button ${dinner === true ? 'selected' : ''}`}
              onClick={() => setDinner(true)}
            >
              Yes
            </button>
            <button
              type="button"
              className={`option-button ${dinner === false ? 'selected' : ''}`}
              onClick={() => setDinner(false)}
            >
              No
            </button>
          </div>
        </div>
        <button type="submit" className="submit-button">Submit</button>
        {submitted && <p className="success-message">Submitted successfully!</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </section>
  );
};

export default UserForm;
