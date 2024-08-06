const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      'mongodb+srv://nj934572:Hackker786@cluster0.enladr4.mongodb.net/',
      {
        // No need for useNewUrlParser and useUnifiedTopology
        ssl: true
      }
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

module.exports = connectDB;
