const Helpline = require('../models/helplines');

// @desc    Get all helplines
// @route   GET /api/v1/helplines
// @access  Public
const getHelplines = async (req, res) => {
  try {
    const openNow = req.query.openNow === 'true';
    let helplines = await Helpline.find({});
    
    if (openNow) {
      const now = new Date();
      const currentDay = now.getDay(); // 0 = Sun, 6 = Sat
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const dayType = currentDay === 0 || currentDay === 6 ? 'weekend' : 'weekday';
      
      console.log(`[FILTER] Time: ${now.toTimeString()} | Day type: ${dayType} | Minutes: ${currentTime}`);
      
      // Filter helplines with available contact methods
      helplines = helplines.map(helpline => {
        const helplineObj = helpline.toObject();
        let hasAvailableMethod = false;
        
        // Go through all the contact options
        const contactTypes = ['voice', 'text', 'email', 'webchat'];
        
        contactTypes.forEach(type => {
          if (!helplineObj.contact[type]) return;
          
          const method = helplineObj.contact[type];
          
          // Check if this method is available now
          let isMethodAvailable = false;
          
          // If theres no availability array the service is 24/7
          if (!Array.isArray(method.availability) || method.availability.length === 0) {
            isMethodAvailable = true;
            console.log(`[ASSUMED 24/7] "${helplineObj.name}" via ${type}`);
          } else {
            // Find a matching availability slot for current day type
            const slot = method.availability.find(a => a.day === dayType);
            if (slot && slot.opensAt && slot.closesAt) {
              const [openH, openM] = slot.opensAt.split(':').map(Number);
              const [closeH, closeM] = slot.closesAt.split(':').map(Number);
              
              if (![openH, openM, closeH, closeM].some(isNaN)) {
               
                const openMinutes = openH * 60 + openM;
                const closeMinutes = closeH * 60 + closeM;
                
                if (closeMinutes > openMinutes) {
                  // Normal same-day shift
                  isMethodAvailable = currentTime >= openMinutes && currentTime <= closeMinutes;
                } else {
                  // this is to handle the helplines that close at 00:00
                  isMethodAvailable = currentTime >= openMinutes || currentTime <= closeMinutes;
                }
              
                if (isMethodAvailable) {
                  console.log(`[OPEN] "${helplineObj.name}" via ${type} (${slot.opensAt}–${slot.closesAt})`);
                }
              }
            }
          }
          
          // If method is not available, remove it from the contact object
          if (!isMethodAvailable) {
            delete helplineObj.contact[type];
          } else {
            hasAvailableMethod = true;
          }
        });
        
        return hasAvailableMethod ? helplineObj : null;
      }).filter(Boolean); // take out the helpliens where everything is closed 
      
      console.log(`[RESULT] ${helplines.length} helplines open now.`);
    }
    
    res.status(200).json({ success: true, data: helplines });
  } catch (err) {
    console.error("Error in getHelplines:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getHelplines
};