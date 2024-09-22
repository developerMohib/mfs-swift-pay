// Import necessary modules
const express = require("express");
require("dotenv").config(); // Load environment variables from .env file
const cors = require("cors"); // Import CORS middleware for cross-origin requests

const { hashPassword, comparePassword } = require("./authHelper/authHelpler");

// Set up port from environment variables or default to 8000
const port = process.env.PORT || 8000;

// Create an Express app
const app = express();

// CORS options to allow requests only from specific origins
const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allowed origins

  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));

// Route handler for the root URL (for testing server)
app.get("/", (req, res) => {
  res.status(500).send("swiftPay server is created");
});

// Error handling
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

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`swiftPay server is listening on port ${port}`);
});
