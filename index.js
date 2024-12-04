// Import the Express module to create a web server
const express = requires('express');

// Initialize an instance of an Express application
const app = express();

// Define a GET route for the root URL ('/')
app.get('/', (req, res) => {
    // Send a response 'Homepage' to the client when the root URL is accessed
    res.send('welcome to my first node.js server');
});

// Start the server and make it listen on port 3000
app.listen(3000, (err, data) => {
    // Log a message to the console indicating the server is running
    console.log('app listening on http://localhost:3000');
});
