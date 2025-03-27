/**
 * workoutRoutes.js
 * 
 * Defines routes for workout-related operations using Express Router.
 */

const express = require('express');
const router = express.Router();
const WorkoutController = require('../controllers/workoutController');

/**
 * @route  POST /api/v1/workouts
 * @desc   Creates a new workout.
 */
router.post('/', WorkoutController.create_workout);

/**
 * @route  GET /api/v1/workouts
 * @desc   Retrieves all workouts for the authenticated user.
 */
router.get('/', WorkoutController.get_user_workouts);

/**
 * @route  GET /api/v1/workouts/:id
 * @desc   Retrieves a specific workout by its ID.
 */
router.get('/:id', WorkoutController.get_workout_by_id);

/**
 * @route  PATCH /api/v1/workouts/:id
 * @desc   Partially updates a workout.
 */
router.patch('/:id', WorkoutController.patch_workout);

/**
 * @route  DELETE /api/v1/workouts/:id
 * @desc   Deletes a workout by its ID.
 */
router.delete('/:id', WorkoutController.delete_workout);

module.exports = router;
