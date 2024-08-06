const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('ws');
const responseRoutes = require('./routes/responses'); // Updated path

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://nj934572:Hackker786@cluster0.enladr4.mongodb.net/testsdb?retryWrites=true&w=majority&appName=Cluster0',
      {
        ssl: true
      }
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

connectDB();

app.use('/responses', responseRoutes);

const server = http.createServer(app);
const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.post('/responses', async (req, res) => {
  const newResponse = new Response(req.body);
  try {
    const savedResponse = await newResponse.save();
    res.status(201).send(savedResponse);
    // Broadcast new response to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify(savedResponse));
      }
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
