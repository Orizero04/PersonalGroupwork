const EmergencyContact = require('../models/emergencyContacts');

/**
 * @route   POST /api/v1/emergency-contacts
 * @desc    Create a new emergency contact
 * @access  Private
 */
const addEmergencyContact = async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, gender } = req.body;
    const userId = req.user._id;

    if (!firstName || !lastName || !mobileNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    const newContact = await EmergencyContact.create({
      firstName,
      lastName,
      mobileNumber,
      gender,
      userId
    });

    return res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: newContact
    });
  } catch (error) {
    console.error('Error adding contact:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        if (err.path === 'firstName' || err.path === 'lastName') {
          return 'Names must be 2–30 letters and only contain letters, spaces, or hyphens.';
        }
        if (err.path === 'mobileNumber') {
          return 'Please enter a valid mobile number (10–15 digits, optional +).';
        }
        if (err.path === 'gender') {
          return 'Gender must be either male, female, or other.';
        }
        return err.message; // fallback for any other field
      });

      return res.status(400).json({
        success: false,
        message: messages.join(' ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while adding contact.'
    });
  }
};

/**
 * @route   GET /api/v1/emergency-contacts
 * @desc    Get all emergency contacts for the authenticated user
 * @access  Private
 */
const getEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const contacts = await EmergencyContact.find({ userId });

    return res.status(200).json({
      success: true,
      data: contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while retrieving contacts.'
    });
  }
};

/**
 * @route   PUT /api/v1/emergency-contacts/:id
 * @desc    Update a specific emergency contact for the authenticated user
 * @access  Private
 */
const updateEmergencyContact = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, mobileNumber, gender } = req.body;

    const updated = await EmergencyContact.findOneAndUpdate(
      { _id: req.params.id, userId },
      { firstName, lastName, mobileNumber, gender },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or unauthorized'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: updated
    });
  } catch (error) {
    console.error('Error updating contact:', error);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => {
        if (err.path === 'firstName' || err.path === 'lastName') {
          return 'Names must be 2–30 letters and only contain letters, spaces, or hyphens.';
        }
        if (err.path === 'mobileNumber') {
          return 'Please enter a valid mobile number (10–15 digits, optional +).';
        }
        if (err.path === 'gender') {
          return 'Gender must be either male, female, or other.';
        }
        return err.message;
      });

      return res.status(400).json({
        success: false,
        message: messages.join(' ')
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while updating contact.'
    });
  }
};

/**
 * @route   DELETE /api/v1/emergency-contacts/:id
 * @desc    Delete a specific emergency contact for the authenticated user
 * @access  Private
 */
const deleteEmergencyContact = async (req, res) => {
  try {
    const userId = req.user._id;

    const deleted = await EmergencyContact.findOneAndDelete({
      _id: req.params.id,
      userId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found or unauthorized'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return res.status(500).json({
      success: false,
      message: 'An unexpected server error occurred while deleting contact.'
    });
  }
};

module.exports = {
  addEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
  deleteEmergencyContact
};
