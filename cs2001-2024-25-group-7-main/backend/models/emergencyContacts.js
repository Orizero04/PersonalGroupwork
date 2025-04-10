const mongoose = require('mongoose');

// Connect to the support database
const supportDb = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'support' 
});

// Define emergency contact schema with backend validation 
const EmergencyContactSchema = new mongoose.Schema({

  userId: {  
    type: String,
    required: true
  },

  firstName: {
    type: String,
    required: true,
    match: /^[A-Za-z\s\-]{2,30}$/
  },

  lastName: {
    type: String,
    required: true,
    match: /^[A-Za-z\s\-]{2,30}$/
  },

  mobileNumber: {
    type: String,
    required: true,
    match: /^\+?\d{10,15}$/
  },

  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  }

}, {
  timestamps: true
});

// Export the model
const EmergencyContact = supportDb.model('EmergencyContact', EmergencyContactSchema, 'emergencycontacts');

module.exports = EmergencyContact;
