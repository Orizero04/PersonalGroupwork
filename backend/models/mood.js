const mongoose = require('mongoose');

const MoodSchema = new mongoose.Schema({
userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},
timestamp: {
    type: Date,
    required: true,
    default: Date.now
},
beforeMood: {
    type: Number,
    required: true,
    min: 1,
    max: 5
},
beforeEnergy: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
},
beforeMotivation: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
},
afterMood: {
    type: Number,
    required: true,
    min: 1,
    max: 5
},
improvedMood: {
    type: String,
    required: true,
    enum: ['Yes', 'Somewhat', 'No']
},
workoutAgain: {
    type: String,
    required: true,
    enum: ['Yes', 'Maybe', 'No']
}
}, {
timestamps: true
});

module.exports = mongoose.model('Mood', MoodSchema); 