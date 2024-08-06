const express = require('express');
const router = express.Router();
const Response = require('../models/response'); // Ensure this path is correct

// POST request handler
router.post('/', async (req, res) => {
  const { employeeID, employeeName, breakfast, dinner, submissionDate } = req.body; // Updated field names

  try {
    console.log('Received Data:', { employeeID, employeeName, breakfast, dinner, submissionDate });
    const newResponse = new Response({
      employeeID, // Updated field name
      employeeName, // Updated field name
      breakfast,
      dinner,
      submissionDate: new Date(submissionDate) // Ensure this is a Date object
    });
    const savedResponse = await newResponse.save();

    console.log('Saved Response:', savedResponse);
    
    // Broadcast new response to all connected clients
    const broadcast = (message) => {
      if (typeof broadcastWss !== 'undefined') {
        broadcastWss.clients.forEach((client) => {
          if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
          }
        });
      } else {
        console.error('WebSocket server is not available for broadcasting.');
      }
    };

    broadcast(savedResponse);
    
    res.status(201).json(savedResponse);
  } catch (error) {
    console.error('Error in POST /:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET request handler for daily responses
router.get('/daily', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const dailyResponses = await Response.find({
      submissionDate: { $gte: startOfDay, $lte: endOfDay }
    });

    console.log('Daily Responses from DB:', dailyResponses);
    res.status(200).json(dailyResponses);
  } catch (error) {
    console.error('Error in GET /daily:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET request handler for monthly responses
router.get('/monthly', async (req, res) => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    
    const monthlyResponses = await Response.find({
      submissionDate: { $gte: startOfMonth, $lte: endOfMonth }
    });

    console.log('Monthly Responses from DB:', monthlyResponses);
    res.status(200).json(monthlyResponses);
  } catch (error) {
    console.error('Error in GET /monthly:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
