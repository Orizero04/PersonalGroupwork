const mongoose = require("mongoose");

/**
 * WorkoutSchema
 * 
 * Defines the structure of workout documents in the database.
 */
 
const WorkoutSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: false,
    },
    dateTime: {
        type: Date,
        required: true,
    },
    exercises: [
        {
            exerciseId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Exercise", 
                required: true,
            },
            sets: { type: Number, required: false },
            reps: { type: Number, required: false },
            timeInMinutes: { type: Number, required: false },
            distanceInKm: { type: Number, required: false },
        }
    ],
}, {timestamps: true});

module.exports = mongoose.model("Workout", WorkoutSchema, "workouts");

