const cloudinary = require('../utils/cloudinary');
const Post = require('../models/postModel');
const ErrorResponse = require('../utils/errorResponse');
const main = require('../app');

// Create a new post
exports.createPost = async (req, res, next) => {
    const { title, content, image } = req.body;

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
            folder: "posts",
            width: 1200,
            crop: "scale"
        });

        // Create the post with the uploaded image
        const post = await Post.create({
            title,
            content,
            postedBy: req.user._id,
            image: {
                public_id: result.public_id,
                url: result.secure_url
            },
        });

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};

// Show all posts
exports.showPost = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        next(error);
    }
};

// Show a single post by ID
exports.showSinglePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id).populate('comments.postedBy', 'name');
        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};

// Delete a post by ID
exports.deletePost = async (req, res, next) => {
    try {
        const currentPost = await Post.findById(req.params.id);

        // Delete post image from Cloudinary
        const ImgId = currentPost.image.public_id;
        if (ImgId) {
            await cloudinary.uploader.destroy(ImgId);
        }

        // Remove the post
        await Post.findByIdAndRemove(req.params.id);

        res.status(200).json({
            success: true,
            message: "Post deleted"
        });
    } catch (error) {
        next(error);
    }
};

// Update a post by ID
exports.updatePost = async (req, res, next) => {
    try {
        const { title, content, image } = req.body;
        const currentPost = await Post.findById(req.params.id);

        // Build the object data for the update
        const data = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            image: image || currentPost.image,
        };

        // Conditional update of the post image
        if (req.body.image !== '') {
            const ImgId = currentPost.image.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }

            const newImage = await cloudinary.uploader.upload(req.body.image, {
                folder: 'posts',
                width: 1200,
                crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            };
        }

        // Update the post and get the updated post
        const postUpdate = await Post.findByIdAndUpdate(req.params.id, data, { new: true });

        res.status(200).json({
            success: true,
            postUpdate
        });
    } catch (error) {
        next(error);
    }
};

// Add a comment to a post
exports.addComment = async (req, res, next) => {
    const { comment } = req.body;
    try {
        // Add the comment to the post and get the updated post
        const postComment = await Post.findByIdAndUpdate(req.params.id, {
            $push: { comments: { text: comment, postedBy: req.user._id } }
        }, { new: true });

        // Retrieve the post with populated comments
        const post = await Post.findById(postComment._id).populate('comments.postedBy', 'name email');

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};

// Add a like to a post
exports.addLike = async (req, res, next) => {
    try {
        // Add the user's ID to the likes array of the post
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $addToSet: { likes: req.user._id }
        }, { new: true });

        // Retrieve all posts and emit an event for adding a like
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        main.io.emit('add-like', posts);

        res.status(200).json({
            success: true,
            post,
            posts
        });
    } catch (error) {
        next(error);
    }
};

// Remove a like from a post
exports.removeLike = async (req, res, next) => {
    try {
        // Remove the user's ID from the likes array of the post
        const post = await Post.findByIdAndUpdate(req.params.id, {
            $pull: { likes: req.user._id }
        }, { new: true });

        // Retrieve all posts and emit an event for removing a like
        const posts = await Post.find().sort({ createdAt: -1 }).populate('postedBy', 'name');
        main.io.emit('remove-like', posts);

        res.status(200).json({
            success: true,
            post
        });
    } catch (error) {
        next(error);
    }
};
