const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the schema for the User model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'First name is required'],
        maxlength: 32,
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'E-mail is required'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        trim: true,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must have at least (6) characters'],
    },
    role: {
        type: String,
        default: 'user' // Default role is 'user'
    }
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps to the documents

// Middleware to encrypt the password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10); // Hash the password using bcrypt
});

// Method to compare user password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}

// Method to generate a JWT token for the user
userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
        expiresIn: 3600 // Token expires in 3600 seconds (1 hour)
    });
}

// Create and export the User model based on the schema
module.exports = mongoose.model('User', userSchema);
