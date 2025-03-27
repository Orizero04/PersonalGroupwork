const mongoose = require('mongoose'); //importing mongoose to  define a schema for helplines
const supportDb = mongoose.connection.useDb('support'); 


//Defining availabilty schema with days and time
const AvailabilitySchema = new mongoose.Schema({
  days: [String],
  from: String,
  to: String,
});

//Defining the different cintact options with days and time 
const ContactSchema = new mongoose.Schema({
  voice: { number: String, availability: String },
  text: { number: String, message: String, availability: String },
  email: String,
  webchat: { url: String, availability: String },
});


// Defining the main schema for helplines 
const HelplineSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    contact: { type: ContactSchema, required: true },
    availability: { type: [AvailabilitySchema], default: [] },
  },
  { timestamps: true }
);

module.exports = supportDb.model('Helpline', HelplineSchema, 'helplines'); // exporting the model with schema
