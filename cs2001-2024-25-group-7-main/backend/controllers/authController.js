const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * @route   POST /api/v1/auth/login
 * @desc    Authenticate user and get token
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Please provide both email and password' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and user data
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                forenames: user.forenames,
                surname: user.surname
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Public
 */
exports.logout = async (req, res) => {
    try {
        // Since JWT is stateless, we just return success
        // The client should remove the token
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};

/**
 * @route   GET /api/v1/auth/verify
 * @desc    Verify token and return user data
 * @access  Private
 */
exports.verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                forenames: user.forenames,
                surname: user.surname
            }
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        const { username, email, password, forenames, surname, dateOfBirth, country, city, isPrivate } = req.body;

        // Validate required fields
        if (!username || !email || !password || !forenames || !surname || !dateOfBirth) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }

        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) {
            return res.status(400).json({ error: 'User already exists with this email or username' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create new user
        user = new User({
            username,
            email,
            passwordHash,
            forenames,
            surname,
            dateOfBirth,
            country,
            city,
            isPrivate
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Return token and user data
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                forenames: user.forenames,
                surname: user.surname
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error during registration' });
    }
}; 