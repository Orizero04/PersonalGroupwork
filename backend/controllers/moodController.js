const Mood = require('../models/mood');

/**
 * @route   POST /api/v1/moods
 * @desc    Create a new mood log
 * @access  Private
 */
exports.createMood = async (req, res) => {
    try {
        const { beforeMood, beforeEnergy, beforeMotivation, afterMood, improvedMood, workoutAgain } = req.body;

        // Create new mood log
        const mood = new Mood({
            userId: req.user._id,
            beforeMood,
            beforeEnergy,
            beforeMotivation,
            afterMood,
            improvedMood,
            workoutAgain,
            timestamp: new Date()
        });

        await mood.save();

        res.status(201).json({
            success: true,
            data: mood
        });
    } catch (error) {
        console.error('Error creating mood log:', error);
        res.status(500).json({ error: 'Server error during mood log creation' });
    }
};

/**
 * @route   GET /api/v1/moods/user/:userId
 * @desc    Get all mood logs for a user
 * @access  Private
 */
exports.getUserMoods = async (req, res) => {
    try {
        if (req.params.userId !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to access these mood logs' });
        }

        const moods = await Mood.find({ userId: req.user._id })
            .sort({ timestamp: -1 });

        res.json({
            success: true,
            data: moods
        });
    } catch (error) {
        console.error('Error fetching user moods:', error);
        res.status(500).json({ error: 'Server error while fetching mood logs' });
    }
};

/**
 * @route   GET /api/v1/moods/:id
 * @desc    Get a single mood log
 * @access  Private
 */
exports.getMood = async (req, res) => {
    try {
        const mood = await Mood.findById(req.params.id);

        if (!mood) {
            return res.status(404).json({ error: 'Mood log not found' });
        }

        if (mood.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Not authorized to access this mood log' });
        }

        res.json({
            success: true,
            data: mood
        });
    } catch (error) {
        console.error('Error fetching mood log:', error);
        res.status(500).json({ error: 'Server error while fetching mood log' });
    }
}; 