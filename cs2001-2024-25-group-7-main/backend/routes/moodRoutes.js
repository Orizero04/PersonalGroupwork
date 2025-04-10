const express = require('express');
const router = express.Router();
const moodController = require('../controllers/moodController');
const auth = require('../middleware/auth');

// @route   POST /api/v1/moods
// @desc    Create a new mood log
// @access  Private
router.post('/', auth, moodController.createMood);

// @route   GET /api/v1/moods/user/:userId
// @desc    Get all mood logs for a user
// @access  Private
router.get('/user/:userId', auth, moodController.getUserMoods);

// @route   GET /api/v1/moods/:id
// @desc    Get a single mood log
// @access  Private
router.get('/:id', auth, moodController.getMood);

module.exports = router; 