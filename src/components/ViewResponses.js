import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewResponses.css';

const ViewResponses = () => {
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const result = await axios.get('http://localhost:5000/responses');
        setResponses(result.data);
      } catch (error) {
        console.error('There was an error fetching the responses!', error);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div className="view-responses">
      <h2>Responses</h2>
      <ul>
        {responses.map((response) => (
          <li key={response._id}>
            <p>User ID: {response.userID}</p>
            <p>Username: {response.username}</p>
            <p>Had Breakfast: {response.breakfast ? 'Yes' : 'No'}</p>
            <p>Would like to have Dinner: {response.dinner ? 'Yes' : 'No'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ViewResponses;
