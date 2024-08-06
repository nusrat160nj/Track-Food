const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  employeeID: { type: String, required: true }, // Changed from userID to employeeID
  employeeName: { type: String, required: true }, // Changed from username to employeeName
  breakfast: { type: Boolean, required: true },
  dinner: { type: Boolean, required: true },
  submissionDate: { type: Date, required: true } // Ensure date is of type Date
}, { timestamps: true });

module.exports = mongoose.model('Response', responseSchema);
