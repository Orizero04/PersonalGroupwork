const mongoose = require('mongoose');

// Connecting to the support databse 
const supportDb = mongoose.createConnection(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'support' 
});

// Defning the structure for emergency contacts in the databse
const EmergencyContactSchema = new mongoose.Schema({

  firstName: {
   type: String,
  required: true },

  lastName: {
  type: String,
  required: true },

  mobileNumber: {
  type: String,
  required: true },

  gender: {
  type: String,
  enum: ['male', 'female', 'other'],
  required: true }

}, {
  timestamps: true
});

const EmergencyContact = supportDb.model('EmergencyContact', EmergencyContactSchema, 'emergencycontacts');

module.exports = EmergencyContact;
