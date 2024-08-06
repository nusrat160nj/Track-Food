const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('ws');
const responseRoutes = require('./routes/responses');
const connectDB = require('./database');  // Import the connectDB function

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
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

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});



