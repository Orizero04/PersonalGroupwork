const mongoose = require('mongoose'); //importing mongoose to  define a schema for helplines
const supportDb = mongoose.connection.useDb('support'); 


// defining structure for availability
const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['weekday', 'weekend'],
    required: true
  },
  opensAt: {
    type: String,
    required: true
  },
  closesAt: {
    type: String,
    required: true
  }
}, { _id: false });

// defining structure for each contact method
const contactMethodSchema = new mongoose.Schema({
  type: String,
  value: String,
  instruction: String,
  availability: [availabilitySchema]
}, { _id: false });


//defining  the main structure of helplines
const helplineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  contact: {
    voice: contactMethodSchema,
    text: contactMethodSchema,
    email: contactMethodSchema,
    webchat: contactMethodSchema
  }
});

module.exports = supportDb.model('Helpline', helplineSchema);
