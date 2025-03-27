/**
 * muscleController.js
 * 
 * This file contains the controller logic for handling muscle endpoints of the API.
 * 
 */

const Exercise = require("../models/exercise")
const Muscle = require("../models/muscle")
const mongoose = require("mongoose");

/**
 * @route   POST /api/v1/exercises
 * @desc    Creates a new exercise entry in the database.
 * @access  Private (Admin Only)
 * 
 * @requestBody
 * - name: String (required) - The name of the exercise (e.g. "Bench Press").
 * - description: String (required) - A description of the exercise
 * - primaryMuscles: Array (required) - List of **Muscle IDs** for the primary muscles targeted.
 * - secondaryMuscles: Array (optional) - List of **Muscle IDs** for the secondary muscles targeted.
 * - logType: String (required) - Indicates how the exercise is logged
 * - recommended: Object (optional) - Contains guidelines; for example:
 *      - minRecommendedSets: Number (optional)
 *      - maxRecommendedSets: Number (optional)
 *      - minRecommendedReps: Number (optional)
 *      - maxRecommendedReps: Number (optional)
 *      - timeInMinutes: Number (optional)
 *      - distanceInKm: Number (optional)
 * - instructions: Array (required) - Step-by-step instructions for performing the exercise.
 * - commonMistakes: Array (optional) - Common mistakes users should avoid.
 * - equipment: Array (optional) - Equipment needed for the exercise (e.g., "Dumbbells").
 * - exerciseImages: Array (optional) - URLs of images demonstrating the exercise.
 * - tags: Array (optional) - Tags for categorization (e.g. "Strength", "Beginner").
 * 
 * @response
 * - 201: Successfully created a new exercise entry.
 * - 400: Bad request (e.g. missing required fields or invalid muscle references).
 * - 500: Internal server error.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.create_exercise = async (req, res) => {
    try {
        const {
            name,
            description,
            primaryMuscles,
            secondaryMuscles,
            logType,          
            recommended,
            instructions,
            commonMistakes,
            equipment,
            exerciseImages,
            tags
        } = req.body;

        // Validate required fields
        if (!name|| !description || !Array.isArray(primaryMuscles) || primaryMuscles.length === 0 ||
            !Array.isArray(instructions) || instructions.length === 0 || !logType) {

            return res.status(400).json({ error: "Missing required fields" });
        }

        // Validate muscle references
        const primaryMuscleDocs = await Muscle.find({ _id: { $in: primaryMuscles } });
        if (primaryMuscleDocs.length !== primaryMuscles.length) {
            return res.status(400).json({ error: "Invalid primary muscle IDs provided" });
        }

        if (secondaryMuscles) {
            const secondaryMuscleDocs = await Muscle.find({ _id: { $in: secondaryMuscles } });
            if (secondaryMuscleDocs.length !== secondaryMuscles.length) {
                return res.status(400).json({ error: "Invalid secondary muscle IDs provided" });
            }
        }

        // Create new exercise
        const newExercise = new Exercise({
            name,
            description,
            primaryMuscles,
            secondaryMuscles,
            logType,     
            recommended,
            instructions,
            commonMistakes,
            equipment,
            exerciseImages,
            tags
        });

        await newExercise.save();

        res.status(201).json({
            message: "Exercise created successfully",
            exercise: newExercise,
        });
    } catch (error) {
        console.error("Error creating exercise:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @route   GET /api/v1/exercises
 * @desc    Fetch exercises with pagination, text search, and filtering.
 * @access  Public
 *
 * Query Parameters:
 * - page: The page number (default: 1)
 * - limit: Number of exercises per page (default: 20)
 * - search: Text to search in the exercise name or description.
 * - muscle: A Muscle ObjectId to filter exercises that target this muscle (in primary or secondary).
 * - logType: Filter exercises by their logType ("setsAndReps", "time", or "distance").
 *
 * @response
 * - 200: Returns an object containing an array of exercises along with pagination metadata.
 * - 500: Internal server error.
 */
exports.get_all_exercises = async (req, res) => {
    try {

        // Set up pagination defaults
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        // Enforce max of 10 pages:
        const MAX_PAGES = 10;
        if (page > MAX_PAGES) {
            page = MAX_PAGES;
        }

        const skip = (page - 1) * limit;

        // Build an array of filter conditions
        const filterConditions = [];

        // Text search: Search in name and description (case-insensitive)
        if (req.query.search) {
            const search = req.query.search;
            filterConditions.push({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            });
        }

        // Filter by muscle: Check if the provided muscle is in primaryMuscles or secondaryMuscles
        if (req.query.muscle) {
            const muscle = req.query.muscle;
            filterConditions.push({
                $or: [
                    { primaryMuscles: muscle },
                    { secondaryMuscles: muscle }
                ]
            });
        }

        // Filter by log type
        if (req.query.logType) {
            filterConditions.push({ logType: req.query.logType });
        }

        // Combine filter conditions. If there are multiple conditions, they must all be met.
        const filterQuery = filterConditions.length > 0 ? { $and: filterConditions } : {};

        // Count total documents that match the filter
        const total = await Exercise.countDocuments(filterQuery);

        // Fetch exercises with applied filters, pagination, and population for muscle references
        const exercises = await Exercise.find(filterQuery)
            .populate("primaryMuscles secondaryMuscles")
            .skip(skip)
            .limit(limit);

        // Calculate total pages, but cap at MAX_PAGES
        let totalPages = Math.ceil(total / limit);
        if (totalPages > MAX_PAGES) {
            totalPages = MAX_PAGES;
        }

        res.status(200).json({
            data: exercises,
            total,
            page,
            limit,
            totalPages
        });
    } catch (error) {
        console.error("Error fetching exercises:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @route   GET /api/v1/exercises/:id
 * @desc    Fetch a single exercise by its ID.
 * @access  Public
 *
 * @param {string} id - The unique identifier of the exercise.
 *
 * @response
 * - 200: Returns the exercise object (populated with muscle data).
 * - 400: Invalid exercise ID format.
 * - 404: Exercise not found.
 * - 500: Internal server error.
 */
exports.get_exercise_by_id = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid exercise ID format" });
        }

        // Fetch exercise by ID, populating muscle references
        const exercise = await Exercise.findById(id)
            .populate("primaryMuscles secondaryMuscles");

        if (!exercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }

        res.status(200).json(exercise);
    } catch (error) {
        console.error("Error fetching exercise:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @route   PATCH /api/v1/exercises/:id
 * @desc    Update an existing exercise.
 * @access  Private (Admin Only)
 * 
 * @requestBody
 * - Any of the exercise fields that need to be updated.
 * 
 * @param {string} id - The unique identifier of the exercise.
 * 
 * @response
 * - 200: Successfully updated the exercise.
 * - 400: Bad request (e.g., invalid exercise ID or update data).
 * - 404: Exercise not found.
 * - 500: Internal server error.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.update_exercise = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid exercise ID format" });
        }

        const updatedExercise = await Exercise.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

        if (!updatedExercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }

        res.status(200).json({
            message: "Exercise updated successfully",
            exercise: updatedExercise,
        });
    } catch (error) {
        console.error("Error updating exercise:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

/**
 * @route   DELETE /api/v1/exercises/:id
 * @desc    Delete an exercise entry.
 * @access  Private (Admin Only)
 * 
 * @param {string} id - The unique identifier of the exercise to delete.
 * 
 * @response
 * - 200: Successfully deleted the exercise.
 * - 400: Bad request (e.g. invalid exercise ID).
 * - 404: Exercise not found.
 * - 500: Internal server error.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
exports.delete_exercise = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid exercise ID format" });
        }

        const deletedExercise = await Exercise.findByIdAndDelete(id);

        if (!deletedExercise) {
            return res.status(404).json({ error: "Exercise not found" });
        }

        res.status(200).json({ message: "Exercise deleted successfully" });
    } catch (error) {
        console.error("Error deleting exercise:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
