const ErrorResponse = require('../utils/errorResponse');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Middleware to check if the user is authenticated
exports.isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    // Check if a token exists in cookies
    if (!token) {
        return next(new ErrorResponse('You must log in...', 401));
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user based on the decoded token's ID
        req.user = await User.findById(decoded.id);
        
        // Continue to the next middleware or route handler
        next();

    } catch (error) {
        return next(new ErrorResponse('You must log in', 401));
    }
}

// Middleware for checking if the user is an admin
exports.isAdmin = (req, res, next) => {
    // Check if the user's role is 'user'; if so, deny access
    if (req.user.role === 'user') {
        return next(new ErrorResponse('Access denied, you must be an admin', 401));
    }
    
    // If the user is an admin, allow them to proceed
    next();
}
