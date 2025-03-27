/**
 * server.js
 * 
 * This file serves as the entry point for the backend server. It:
 * - Loads environment variables
 * - Connects to the MongoDB database
 * - Starts the Express server
 * 
 */

const app = require('./app');
const dotenv = require('dotenv');
const connectDB = require('./config/db');









// Load environment variables from .env file
dotenv.config();

// Connect to the database and then start the server
connectDB().then(() => {
     // Use the PORT from the environment or default to 5000
    const PORT = process.env.PORT || 5000;

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((error) => {
    // If the database connection fails, log the error and exit the process
    console.error(`Failed to connect to the database: ${error.message}`);
    process.exit(1);
});
