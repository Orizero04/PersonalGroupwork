/**
 * workoutController.js
 * 
 * This file contains the controller logic for handling workout endpoints of the API.
 * 
 * 
 */

const Workout = require('../models/workout');
const mongoose = require('mongoose');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * @route   POST /api/v1/workouts
 * @desc    Creates a new workout document in the database.
 * @access  Private (Requires JWT authentication)
 * 
 * @headers
 * - Authorization: Bearer <JWT Token>
 * 
 * @requestBody
 * - title: String (required) - Title of the workout.
 * - description: String (optional) - Description of the workout.
 * - dateTime: Date (required) - The date and time of the workout.
 * - exercises: Array (required) - An array of exercise objects, each containing:
 *    - exerciseId: ObjectId (required) - References an exercise.
 *    - sets: Number (optional) - Number of sets.
 *    - reps: Number (optional) - Number of reps.
 *    - timeInMinutes: Number (optional) - Duration in minutes.
 *    - distanceInKm: Number (optional) - Distance in kilometers.
 * 
 * @response
 * - 201: Successfully created a new workout.
 * - 400: Bad request (e.g., missing required fields).
 * - 401: Unauthorized (if token is missing or invalid).
 * - 500: Internal server error.
 */
exports.create_workout = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        // Verify token to extract user id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // Destructure fields from the request body
        const { title, description, dateTime, exercises } = req.body;

        // Check required fields
        if (!title || !dateTime || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return res.status(400).json({ error: 'Title, dateTime, and at least one exercise are required.' });
        }

        // Validate each exercise in the array
        for (let ex of exercises) {
            if (!ex.exerciseId) {
                return res.status(400).json({ error: 'Each exercise must have an exerciseId.' });
            }
        }

        // Create a new workout instance
        const newWorkout = new Workout({
            userId,
            title,
            description,
            dateTime,
            exercises
        });

        // Save the workout to the database
        await newWorkout.save();

        // Respond with the newly created workout
        res.status(201).json({
            message: 'Workout created successfully.',
            workout: newWorkout,
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @route   GET /api/v1/workouts
 * @desc    Retrieves all workouts created by the authenticated user.
 * @access  Private (Requires JWT authentication)
 * 
 * @headers
 * - Authorization: Bearer <JWT Token>
 * 
 * @response
 * - 200: Successfully retrieved the list of workouts.
 * - 401: Unauthorized (if token is missing or invalid).
 * - 500: Internal server error.
 */
exports.get_user_workouts = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        // Verify token and extract user id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // Query for workouts belonging to the authenticated user
        const workouts = await Workout.find({ userId });

        res.status(200).json({
            message: 'Workouts retrieved successfully.',
            workouts,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @route   GET /api/v1/workouts/:id
 * @desc    Retrieves a specific workout by its ID for the authenticated user.
 * @access  Private (Requires JWT authentication)
 * 
 * @headers
 * - Authorization: Bearer <JWT Token>
 * 
 * @response
 * - 200: Successfully retrieved workout.
 * - 400: Bad request (e.g., invalid workout ID).
 * - 401: Unauthorized (if token is missing or invalid).
 * - 404: Workout not found.
 * - 500: Internal server error.
 */
exports.get_workout_by_id = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        // Verify token and extract user id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // Validate and extract workout ID from the route parameters
        const workoutId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).json({ error: 'Invalid workout ID.' });
        }

        // Find the workout that belongs to the authenticated user
        const workout = await Workout.findOne({ _id: workoutId, userId });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found.' });
        }

        res.status(200).json({
            message: 'Workout retrieved successfully.',
            workout,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @route   PATCH /api/v1/workouts/:id
 * @desc    Partially updates a workout document for the authenticated user.
 * @access  Private (Requires JWT authentication)
 * 
 * @headers
 * - Authorization: Bearer <JWT Token>
 * 
 * @requestBody (all fields optional)
 * - title: String (optional) - New title for the workout.
 * - description: String (optional) - New description.
 * - workoutDate: Date (optional) - New date/time for the workout.
 * - exercises: Array (optional) - Array of exercise updates, where each object should contain:
 *    - exerciseId: ObjectId (required) - To identify which exercise entry to update.
 *    - sets: Number (optional) - Updated number of sets.
 *    - reps: Number (optional) - Updated number of reps.
 *    - timeInMinutes: Number (optional) - Updated duration in minutes.
 *    - distanceInKm: Number (optional) - Updated distance in kilometers.
 * 
 * @response
 * - 200: Successfully updated workout.
 * - 400: Bad request (e.g., invalid workout ID).
 * - 401: Unauthorized (if token is missing or invalid).
 * - 404: Workout not found.
 * - 500: Internal server error.
 */
exports.patch_workout = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        // Verify token and extract user id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // Validate workout ID from the route parameters
        const workoutId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).json({ error: 'Invalid workout ID.' });
        }

        // Find the workout that belongs to the authenticated user
        const workout = await Workout.findOne({ _id: workoutId, userId });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found.' });
        }

        // Update top-level fields if provided in the request body
        const { title, description, workoutDate, exercises } = req.body;
        if (title !== undefined) workout.title = title;
        if (description !== undefined) workout.description = description;
        if (workoutDate !== undefined) workout.workoutDate = workoutDate;

        // If exercises updates are provided, process each update
        if (exercises && Array.isArray(exercises)) {
            
            // Create an array of exercise IDs from the incoming payload
            const incomingIds = exercises.map(item => item.exerciseId.toString());

            // Remove any exercises that are not included in the incoming payload
            workout.exercises = workout.exercises.filter(item =>
                incomingIds.includes(item.exerciseId.toString())
            );

            // Now update existing exercises or add new ones
            exercises.forEach((updateItem) => {
                if (!updateItem.exerciseId) {
                    return;
                }
                // Find the index of the existing exercise entry in the workout
                const index = workout.exercises.findIndex(item => item.exerciseId.toString() === updateItem.exerciseId);

                if (index !== -1) {
                    // Update only provided fields for the existing exercise entry
                    if (updateItem.sets !== undefined) workout.exercises[index].sets = updateItem.sets;
                    if (updateItem.reps !== undefined) workout.exercises[index].reps = updateItem.reps;
                    if (updateItem.timeInMinutes !== undefined) workout.exercises[index].timeInMinutes = updateItem.timeInMinutes;
                    if (updateItem.distanceInKm !== undefined) workout.exercises[index].distanceInKm = updateItem.distanceInKm;
                } else {
                    // If the exercise is not already in the workout, add it as a new entry.
                    workout.exercises.push(updateItem);
                }
            });
        }


        // Save the updated workout
        await workout.save();

        res.status(200).json({
            message: 'Workout updated successfully.',
            workout,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

/**
 * @route   DELETE /api/v1/workouts/:id
 * @desc    Deletes a workout document for the authenticated user.
 * @access  Private (Requires JWT authentication)
 * 
 * @headers
 * - Authorization: Bearer <JWT Token>
 * 
 * @response
 * - 200: Successfully deleted workout.
 * - 400: Bad request (e.g., invalid workout ID).
 * - 401: Unauthorized (if token is missing or invalid).
 * - 404: Workout not found.
 * - 500: Internal server error.
 */
exports.delete_workout = async (req, res) => {
    try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized. No token provided.' });
        }

        // Verify token and extract user id
        const decoded = verifyToken(token);
        const userId = decoded.id;

        // Validate workout ID from the route parameters
        const workoutId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(workoutId)) {
            return res.status(400).json({ error: 'Invalid workout ID.' });
        }

        // Find the workout that belongs to the authenticated user
        const workout = await Workout.findOne({ _id: workoutId, userId });
        if (!workout) {
            return res.status(404).json({ error: 'Workout not found.' });
        }

        // Delete the workout
        await Workout.deleteOne({ _id: workoutId, userId });

        // Respond with success
        res.status(200).json({
            message: 'Workout deleted successfully.',
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

