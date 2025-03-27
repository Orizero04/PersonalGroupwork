const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/v1/auth/register
// @desc    Register a new user
router.post('/register', authController.register);

// @route   POST /api/v1/auth/login
// @desc    Login user and get token
router.post('/login', authController.login);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
router.post('/logout', authController.logout);

// @route   GET /api/v1/auth/verify
// @desc    Verify token
router.get('/verify', authController.verifyToken);

module.exports = router; 