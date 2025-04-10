/**
 * db.js
 * 
 * This file is responsible for establishing a connection to the MongoDB database using Mongoose.
 * 
 * It exports a function `connectDB` that can be called to initiate the connection.
 */

const mongoose = require('mongoose');

/**
 * connectDB
 * 
 * Asynchronously connects to the MongoDB database using the connection string 
 * stored in the environment variable `MONGO_URI`.
 * 
 * Logs a success message if the connection is successful, or exits the process
 * with an error code if the connection fails.
 */
const connectDB = async () => {
    try {
        // Attempt to connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log a success message to the console
        console.log(`MongoDB Succesfully Connected: ${conn.connection.host}`)
        
    } catch (error) {

        // Log the error message and exit the application with a failure code
        console.error(`Error: ${error.message}`);

        // Exit the process with status code 1 (failure)
        process.exit(1);
    }
};

module.exports = connectDB;
