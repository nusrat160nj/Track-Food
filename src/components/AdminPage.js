import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import './AdminPage.css';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, BarElement, CategoryScale, LinearScale);

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error('Invalid date string:', dateString);
    return 'Invalid Date';
  }

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  // Format the date as DD-MM-YYYY
  return `${day}-${month}-${year}`;
};

const AdminPage = () => {
  const [dailyResponses, setDailyResponses] = useState([]);
  const [monthlyResponses, setMonthlyResponses] = useState([]);
  const [ws, setWs] = useState(null);

  // Fetch daily responses from the server
  const fetchDailyResponses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/responses/daily');
      console.log('Fetched Daily Responses:', response.data); // Log the response
      setDailyResponses(response.data);
    } catch (error) {
      console.error('Error fetching daily responses:', error);
    }
  };

  // Fetch monthly responses from the server
  const fetchMonthlyResponses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/responses/monthly');
      console.log('Fetched Monthly Responses:', response.data); // Log the response
      setMonthlyResponses(response.data);
    } catch (error) {
      console.error('Error fetching monthly responses:', error);
    }
  };

  useEffect(() => {
    // Fetch data initially
    fetchDailyResponses();
    fetchMonthlyResponses();

    // Set up WebSocket connection
    const socket = new WebSocket('ws://localhost:5000');
    setWs(socket);

    // Handle incoming WebSocket messages
    socket.onmessage = (event) => {
      const newResponse = JSON.parse(event.data);
      console.log('New Response:', newResponse);
      // Update daily and monthly responses with the new data
      setDailyResponses(prev => [newResponse, ...prev]);
      setMonthlyResponses(prev => [newResponse, ...prev]);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      socket.close();
    };
  }, []);

  // Prepare data for pie chart
  const getPieChartData = () => {
    const breakfastCount = monthlyResponses.filter(response => response.breakfast).length;
    const dinnerCount = monthlyResponses.filter(response => response.dinner).length;

    return {
      labels: ['Breakfast', 'Dinner'],
      datasets: [
        {
          label: 'Meal Preferences',
          data: [breakfastCount, dinnerCount],
          backgroundColor: ['#1E90FF', '#800080'],  // (#FFD1DC) and pastel green (#C1E1C1):

          

        },
      ],
    };
  };

  // Prepare data for bar charts
  const getBarChartData = () => {
    const breakfastData = dailyResponses.filter(response => response.breakfast).length;
    const dinnerData = dailyResponses.filter(response => response.dinner).length;

    return {
      labels: ['Breakfast', 'Dinner'],
      datasets: [
        {
          label: 'Daily Responses',
          data: [breakfastData, dinnerData],
          backgroundColor: ['#1E90FF', '#800080'], 
  
          borderColor: ['#4B0082', '#36A2EB'],
          borderWidth: 1,
        },
      ],
    };
  };

  // Pie chart options
  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000', // Black color
          font: {
            weight: 'bold', // Bold text
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw + '%';
          },
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 1,
      },
    },
  };

  // Bar chart options
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#000', // Black color
          font: {
            weight: 'bold', // Bold text
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: '#000', // Black color
          font: {
            weight: 'bold', // Bold text
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: '#000', // Black color
          font: {
            weight: 'bold', // Bold text
          },
        },
      },
    },
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <h2>Responses Overview</h2>
      </header>
      <div className="table-container">
        <div className="daily-table">
          <div className="table-header">Daily Responses</div>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Submission Date</th>
                <th>Breakfast</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {dailyResponses.map((response) => (
                <tr key={response._id}>
                  <td>{response.employeeName}</td>
                  <td>{formatDate(response.submissionDate)}</td>
                  <td>{response.breakfast ? 'Yes' : 'No'}</td>
                  <td>{response.dinner ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="monthly-table">
          <div className="table-header">Monthly Responses</div>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Submission Date</th>
                <th>Breakfast</th>
                <th>Dinner</th>
              </tr>
            </thead>
            <tbody>
              {monthlyResponses.map((response) => (
                <tr key={response._id}>
                  <td>{response.employeeName}</td>
                  <td>{formatDate(response.submissionDate)}</td>
                  <td>{response.breakfast ? 'Yes' : 'No'}</td>
                  <td>{response.dinner ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="chart-wrapper">
        <div className="chart-container">
          <h3>Monthly Meal Preferences</h3>
          <div className="pie-chart">
            <Pie data={getPieChartData()} options={pieChartOptions} />
          </div>
        </div>
        <div className="chart-container">
          <h3>Daily Meal Preferences</h3>
          <div className="bar-chart">
            <Bar data={getBarChartData()} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
