/**
 * app.js
 * 
 * This file sets up the main Express application, including middleware, routing,
 * and any global configuration. It is the central entry point for defining the
 * application's structure.
 * 
 * The `app` instance is exported to be used in `server.js` for starting the server.
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const statusRoutes = require('./routes/statusRoutes');
const userRoutes = require('./routes/userRoutes');
const muscleRoutes = require('./routes/muscleRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const helplinesRoutes = require('./routes/helplinesRoutes'); // Import helplines route
const workoutRoutes = require('./routes/workoutRoutes');
const authRoutes = require('./routes/authRoutes');
const moodRoutes = require('./routes/moodRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes'); 

// Initialize the Express application
const app = express();

// Middleware
/**
 * CORS Middleware:
 * Enables Cross-Origin Resource Sharing to allow the backend to serve requests 
 * from different origins.
 */
app.use(cors());

/**
 * JSON Body Parser Middleware:
 * Parses incoming JSON request bodies and makes them available under req.body.
 */
app.use(express.json());

/**
 * Static File Middleware:
 * Serves static files such as images stored in the `public` directory.
 * 
 * Example:
 * - Images stored in `public/images/muscles/biceps.png`
 * - Accessible at `http://localhost:5001/static/images/muscles/biceps.png`
 */
app.use('/static', express.static(path.join(__dirname, 'public')));

// Routes
/**
 * Status Routes:
 * Mounts the status-related routes under the '/api/v1/status' path.
 */
app.use('/api/v1/status', statusRoutes);

/**
 * User Routes:
 * Mounts the user-related routes under the '/api/v1/users' path. 
 */
app.use('/api/v1/users', userRoutes);

/**
 * Muscle Routes:
 * Mounts the muscle-related routes under the '/api/v1/muscles' path. 
 */
app.use('/api/v1/muscles', muscleRoutes);

/**
 * Exercises Routes:
 * Mounts the exercise-related routes under the '/api/v1/exercises' path. 
 */
app.use('/api/v1/exercises', exerciseRoutes);

/**
 * Workout Routes:
 * Mounts the exercise-related routes under the '/api/v1/workouts' path. 
 */
app.use('/api/v1/workouts', workoutRoutes);

/**
 * Auth Routes:
 * Mounts the authentication-related routes under the '/api/v1/auth' path. 
 */
app.use('/api/v1/auth', authRoutes);

/**
 * Mood Routes:
 * Mounts the mood-related routes under the '/api/v1/moods' path. 
 */
app.use('/api/v1/moods', moodRoutes);

/**
 * Emergency Contacts Routes:
 * Mounts the emergency contact-related routes under the '/api/v1/emergency-contacts' path.
 */
app.use('/api/v1/emergency-contacts', emergencyRoutes); 

/**
 * Helplines Routes:
 * Mounts the helplines-related routes under the '/api/v1/helplines' path.
 */
app.use('/api/v1/helplines', helplinesRoutes);


module.exports = app;
