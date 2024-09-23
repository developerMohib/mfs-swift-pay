// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware for cross-origin requests
require("dotenv").config(); // Load environment variables from .env file

// bcryptjs function here
const User = require('./models/userSchema')
const { hashPassword, comparePassword } = require("./authHelper/authHelpler");

// Set up port from environment variables or default to 8000
const port = process.env.PORT || 8000;

// ---------------------------- create here an express app ------------------------
// Create an Express app
const app = express();

// ---------------------------------- CORS OPTION ----------------------------------
// ---------------------------------- CORS OPTION ----------------------------------
// CORS options to allow requests only from specific origins
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:8000"], // Allowed origins
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// ---------------------------------- Middleware ----------------------------------
// ---------------------------------- Middleware ----------------------------------
app.use(express.json());
app.use(cors(corsOptions));


// ---------------------------------- mongodb ----------------------------------
// ---------------------------------- mongoose ---------------------------------
mongoose.connect(process.env.MongoDB_url)
.then(()=>{
  console.log('mongoDB connection successfully')
})
.catch(err =>{
  console.log(err)
})

// ---------------------------------- Route Here --------------------------------

// POST route to create a new user
app.post('/users', async (req, res) => {
  try {
    const { userName, userEmail, password,userPhone,userNID,userRole,status } = req.body;
    const userData = { userName, userEmail, password,userPhone,userNID,userRole,status };

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ userEmail });

    if (existingUser) {
      // If email already exists, send an error response
      return res.status(400).send({ error: 'Email already in use. Please use a different email.' });
    }

    // Create a new user
    const newUser = new User(userData);

    // Save the user to the database
    await newUser.save();
    res.status(201).send({ message: 'User created successfully', user: newUser });

  } catch (error) {
    console.error(error);
    res.status(400).send({ error: 'Failed to create user', details: error.message });
  }
});

// Route handler for the root URL (for testing server)
app.get("/", (req, res) => {
  res.status(500).send("swiftPay server is created");
});

// --------------------------------- Error handling ---------------------------------
// --------------------------------- Error handling ---------------------------------
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).json({
      message: err.message || "Internal Server Error",
      error: err, // optional, remove in production for security reasons
    });
  } else {
    // If no specific error, pass control to the next middleware
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
});

// --------------------------------- Port Listen ---------------------------------
// --------------------------------- Port Listen ---------------------------------
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`swiftPay server is listening on port ${port}`);
});
