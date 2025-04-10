const express = require('express');
const auth = require('../middleware/auth'); // Import the auth middleware

// Import the functions from the emergency contacts controller 
const {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
} = require('../controllers/emergencyController');

const router = express.Router(); // initialize the router 

// Define the routes for emergency contacts - all secured with auth middleware
router.route('/') 
  .get(auth, getEmergencyContacts) 
  .post(auth, addEmergencyContact); 

// Define routes by ID for updating and removing contacts 
router.route('/:id')
  .put(auth, updateEmergencyContact)
  .delete(auth, deleteEmergencyContact);

module.exports = router;