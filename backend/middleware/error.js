const ErrorResponse = require('../utils/errorResponse');

// Error handling middleware function
const errorHandler = (err, req, res, next) => {
    // Create a copy of the error object and set its message property
    let error = { ...err };
    error.message = err.message;

    // Handle CastError: Resource not found
    if (err.name === "CastError") {
        const message = `Resource not found with id ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Handle Mongoose duplicate key error (code 11000)
    if (err.code === 11000) {
        const message = "Duplicate field value entered";
        error = new ErrorResponse(message, 400);
    }

    // Handle Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(val => ' ' + val.message);
        error = new ErrorResponse(message, 400);
    }

    // Send the error response with the appropriate status code
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server error"
    });
};

module.exports = errorHandler;
