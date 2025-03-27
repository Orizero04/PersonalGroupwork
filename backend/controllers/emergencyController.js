
const EmergencyContact = require('../models/emergencyContacts');

/*
* POST /
*
* Route: POST /api/v1/emergencycontacts
* Description: Adds a new emergency contact.
*/

const addEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.create(req.body);
    res.status(201).json({ success: true, data: contact });
  } catch (error) {
    console.error('Error adding contact:', error.message);
    res.status(500).json({ success: false, message: 'Server error while adding contact.' });
  }
};


/*
* GET /
*
* Route: GET /api/v1/emergencycontacts
* Description: Fetches all emergency contacts.
*/
const getEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find();
    res.status(200).json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error fetching contacts:', error.message);
    res.status(500).json({ success: false, message: 'Server error while retrieving contacts.' });
  }
};

/*
* PUT /
*
* Route: PUT /api/v1/emergencycontacts/:id
* Description: Updates an existing emergency contact.
*/

const updateEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, data: contact });
  } catch (error) {
    console.error('Error updating contact:', error.message);
    res.status(500).json({ success: false, message: 'Server error while updating contact.' });
  }
};

/*
* DELETE /
*
* Route: DELETE /api/v1/emergencycontacts/:id
* Description: Deletes an existing emergency contact.
*/
const deleteEmergencyContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact not found' });
    }

    res.status(200).json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    console.error(' Error deleting contact:', error.message);
    res.status(500).json({ success: false, message: 'Server error while deleting contact.' });
  }
};

module.exports = {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact
};
