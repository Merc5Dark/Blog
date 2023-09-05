const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

// Define the schema for the Post model
const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        postedBy: {
            type: ObjectId,
            ref: "User", // Reference to the User model for the author of the post
        },
        image: {
            url: String,
            public_id: String,
        },
        likes: [{ type: ObjectId, ref: "User" }], // Reference to User model for users who liked the post
        comments: [
            {
                text: String,
                created: { type: Date, default: Date.now },
                postedBy: {
                    type: ObjectId,
                    ref: "User", // Reference to User model for users who posted comments
                },
            },
        ],
    },
    { timestamps: true } // Adds createdAt and updatedAt timestamps to the documents
);

// Create and export the Post model based on the schema
module.exports = mongoose.model('Post', postSchema);
