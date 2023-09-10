module.exports = app => {
    const results = require("../controllers/common.controller.js");
  
    var router = require("express").Router();
  
    // Create a new post
    router.post("/posts", results.create);
  
    // Retrieve all posts
    router.get("/posts", results.findAll);
  
    // Update a post with id
    router.put("/posts/:id", results.update);
    
    // Delete a post with id
    router.delete("/posts/:id", results.delete);

    // Update reactions of post
    router.patch("/posts/:id", results.reactions);

    // Retrieve users
    router.get("/users", results.users);

    // Retrieve posts by user id
    router.get("/postsbyuserid", results.postsFindByUserId);
  
    app.use('/', router);
  };