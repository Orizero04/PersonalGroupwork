const Helpline = require('../models/helplines');

// @desc    Get all helplines
// @route   GET /api/v1/helplines
// @access  Public

const getHelplines = async (req, res) => {
  try {
    const helplines = await Helpline.find({});
    const { openNow } = req.query;
    //If openNow is not true, return all helplines
    if (openNow !== 'true') {
      return res.status(200).json({ success: true, data: helplines });
    }
    // get the current time and day 
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // get days in short form like Mon , Tue etc
    const currentDay = now.toLocaleString('en-US', { weekday: 'short' }); 

    // function to check if the helpline is available now
    const isAvailableNow = (availability) => {
      // if theres no availaibility it means it 24 hours
      if (!availability) return true;

      return Array.isArray(availability) && availability.some(({ days, from, to }) => {
        if (!days || days.includes(currentDay)) {
          const [fromHour, fromMin] = from.split(":").map(Number);
          const [toHour, toMin] = to.split(":").map(Number);
          const fromMinutes = fromHour * 60 + fromMin;
          const toMinutes = toHour * 60 + toMin;
          return currentTimeInMinutes >= fromMinutes && currentTimeInMinutes < toMinutes;
        }
        return false;
      });
    };

    // go through the helplienes and only keep the ones that aer available rn 
    const filteredHelplines = helplines.map(helpline => {
      const { contact } = helpline;

      const filteredContact = {};
      if (contact?.voice?.number && isAvailableNow(contact.voice.availability)) {
        filteredContact.voice = contact.voice;
      }
      if (contact?.text?.number && isAvailableNow(contact.text.availability)) {
        filteredContact.text = contact.text;
      }
      if (contact?.email && isAvailableNow(contact.email.availability)) {
        filteredContact.email = contact.email;
      }
      if (contact?.webchat?.url && isAvailableNow(contact.webchat.availability)) {
        filteredContact.webchat = contact.webchat;
      }

      return {
        ...helpline.toObject(),
        contact: filteredContact,
      };
    // if the helpline has no option open then it gets filtered out
    }).filter(h => Object.keys(h.contact).length > 0);

    // reurn the list of filtered helplines
    return res.status(200).json({ success: true, data: filteredHelplines });

  } catch (error) {
    console.error('Error getting helplines:', error);
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

module.exports = { getHelplines };
