// Import the Express framework for building web applications
const express = require ('express');

// Import Mongoose for interacting with a MongoDB database
const mongoose = require ('mongoose');

// Create an instance of an Express application
const app = express();
const env= require('dotenv');
env.config()
// Middleware to parse incoming JSON requests
app.use(express.json());


// Define the port number the application will listen on
const port = process.env.PORT
// define the bcrypt module
const bycrypt = require('bcrypt')
// Define an asynchronous function to connect to the MongoDB database
const db = async () => {
    try {
        // Connect to the MongoDB database at the specified URI
        await mongoose.connect(process.env.DATABASE);
        console.log("database connection established");
    } catch (error) {
        // Log an error if the connection fails
        console.log('error connecting to database');
    }
};

// Call the `db` function to establish a connection to the database
db();

// Define a Mongoose schema for the `User` collection
const Schema = new mongoose.Schema({
    // `userName` field of type String, required
    userName: {
        type: String,
        required: true
    },
    // `email` field of type String, required, and must be unique
    email: {
        type: String,
        required: true,
        unique: true
    },
    // `password` field of type String, required

    password: {
        type: String,
        required: true
    }
});

// Create a Mongoose model for the `User` collection using the schema
const User = mongoose.model('User', Schema);
    
app.get('/', (req, res)=> {
        res.send("Homepage")
    })
// Define a POST route for user signup
app.post('/signup', async (req, res) => {
    try {
        // Destructure the request body to get `userName`, `email`, and `password`
        const { userName, email, password } = req.body;

        // Check if a user with the same email already exists in the database
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            // If the user already exists, respond with a 400 status and a message
            return res.status(400).json({ message: "User already exists, please login" });
        }
        const hashPassword = await bycrypt.hash(password, 10);  // 10 is the saltround for the hashing
        //i.e the number f rounds that the password can be hashed, and the standard is 10-12, 
        // Create a new user document with the provided data using dsestruturing
        const newUser = new User({
            userName: userName,
            email: email,
            password: hashPassword
        });

        // Save the new user document to the database
        await newUser.save();

        // Respond with a success message
        return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
        // Log any errors that occur during the process
        console.log(error);

        // Respond with a 500 status and an error message
        return res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
    
})
//read about  request and respond in express and write about it on dev.to
