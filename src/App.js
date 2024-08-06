// src/App.js
import React from 'react';
import logo from './logoo.png'; // Ensure the file name and path are correct
import './App.css';
import AdminPage from './components/AdminPage';
import UserForm from './components/UserForm';
import AdminLogin from './components/AdminLogin'; // Import AdminLogin

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Home() {
  return (
    <div className="Home">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Food Tracking Application</p>
        <nav className="App-nav">
          <Link className="App-link" to="/userform">
            Go to User Form
          </Link>
          <Link className="App-link" to="/adminlogin">
            Go to Admin Login
          </Link>
        </nav>
      </header>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userform" element={<UserForm />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/adminlogin" element={<AdminLogin />} /> {/* Add AdminLogin route */}
      </Routes>
    </Router>
  );
}

export default App;
