const express = require('express');

// Import the  functions from the emergency contacts controller 
const {
  getEmergencyContacts,
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact
} = require('../controllers/EmergencyController');

const router = express.Router(); // initialise the router 

// Defineing the routes for the memergency contacts 
router.route('/') 
  .get(getEmergencyContacts) 
  .post(addEmergencyContact); 

  // Defining routes by ID for adding and removiing contacts 
  router.route('/:id')
  .put(updateEmergencyContact)
  .delete(deleteEmergencyContact);

module.exports = router;
