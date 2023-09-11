// Import the necessary modules
const express = require('express'); 
const app = express();
const cors = require('cors'); 

// Parse JSON data and URL-encoded data sent in HTTP requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS to allow cross-origin requests
app.use(cors());

// Import and use the routes defined in "common.routes.js"
require("./routes/common.routes")(app);

// Define the base URL and the port on which the server will run
const URL = "http://localhost:";
const PORT = 8080;

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`);
});
