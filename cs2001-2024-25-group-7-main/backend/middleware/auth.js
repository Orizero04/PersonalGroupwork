const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Authentication middleware
 * Verifies the JWT token and adds the user to the request object
 */
module.exports = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'No authentication token, access denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id).select('-passwordHash');
        
        if (!user) {
            return res.status(401).json({ error: 'Token is valid but user not found' });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Token is invalid or expired' });
    }
}; 