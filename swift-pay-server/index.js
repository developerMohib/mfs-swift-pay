// Import necessary modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS middleware for cross-origin requests
require("dotenv").config(); // Load environment variables from .env file
const createUser = require("./Routes/create.user")
const createAgent = require("./Routes/create.agent")


// bcryptjs function here
const User = require("./models/userSchema");
const { comparePassword } = require("./authHelper/authHelpler");

// Set up port from environment variables or default to 8000
const port = process.env.PORT || 8000;

// ---------------------------- create here an express app ------------------------
// Create an Express app
const app = express();

// ---------------------------------- CORS OPTION ----------------------------------
// ---------------------------------- CORS OPTION ----------------------------------
// CORS options to allow requests only from specific origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:8000",
    "https://swift-pay-server-lemon.vercel.app",
  ], // Allowed origins
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// ---------------------------------- Middleware ----------------------------------
// ---------------------------------- Middleware ----------------------------------
app.use(express.json());
app.use(cors(corsOptions));

// ---------------------------------- mongodb ----------------------------------
// ---------------------------------- mongoose ---------------------------------
mongoose
  .connect(process.env.MongoDB_url)
  .then(() => {
    console.log("mongoDB connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// ---------------------------------- Route Here --------------------------------
// testing purpose all user get
app.get("/all-users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users
    res.json(users); // Send the users back as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
});

// Get user by email or phone
app.post("/loginUser", async (req, res) => {
  try {
    const { phoneOrEmail, password } = req.body;

    // Find user by email or phone
    const query = {
      $or: [{ userEmail: phoneOrEmail }, { userPhone: phoneOrEmail }],
    };

    const user = await User.findOne(query);

    // If user is not found
    if (!user) {
      return res.status(404).json({
        message: "User not found. Check your email/phone and try again.",
      });
    }

    // Password validation
    const isPassValid = await comparePassword(password, user.password);
    if (!isPassValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Authentication successful
    return res.status(200).json({
      message: "Authentication successful",
      user, // Send the user object in the response
    });
  } catch (error) {
    // Handle any server errors
    return res.status(500).json({
      message: "Authentication failed, log in error.",
      error: error.message,
    });
  }
});

// route to create a new user
app.use(createUser)
app.use(createAgent)

// Route handler for the root URL (for testing server)
app.get("/", (req, res) => {
  res.status(500).send("swiftPay server is ready");
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
// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`swiftPay server is listening on port ${port}`);
});
