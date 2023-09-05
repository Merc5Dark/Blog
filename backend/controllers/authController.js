const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

// Function to handle user registration
exports.signup = async (req, res, next) => {
    const { email } = req.body;

    try {
        // Check if the user with the given email already exists
        const userExist = await User.findOne({ email });
        if (userExist) {
            return next(new ErrorResponse("E-mail already registered", 400));
        }

        // Create a new user
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};

// Function to handle user login
exports.signin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return next(new ErrorResponse("Please provide email and password", 403));
        }

        // Check if the user with the given email exists
        const user = await User.findOne({ email });
        if (!user) {
            return next(new ErrorResponse("Invalid credentials", 400));
        }

        // Check if the provided password matches the user's password
        const isMatched = await user.comparePassword(password);
        if (!isMatched) {
            return next(new ErrorResponse("Invalid credentials", 400));
        }

        // Send a token response upon successful login
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// Function to send a JSON web token (JWT) response
const sendTokenResponse = async (user, codeStatus, res) => {
    const token = await user.getJwtToken();
    const options = { maxAge: 60 * 60 * 1000, httpOnly: true };

    // Set the 'secure' option for cookies in production environment
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    // Send the token as a cookie and response data
    res
        .status(codeStatus)
        .cookie('token', token, options)
        .json({
            success: true,
            id: user._id,
            role: user.role
        });
};

// Function to handle user logout
exports.logout = (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: "Logged out"
    });
};

// Function to fetch user profile
exports.userProfile = async (req, res, next) => {
    try {
        // Find the user by their ID and exclude the password field
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(error);
    }
};
