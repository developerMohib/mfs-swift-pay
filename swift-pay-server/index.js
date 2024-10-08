// Import necessary modules
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors"); // Import CORS middleware for cross-origin requests
require("dotenv").config(); // Load environment variables from .env file
const createUser = require("./Routes/create.user");
const createAgent = require("./Routes/create.agent");
const { loginAdmin } = require("./controllers/admin.controller");
// bcryptjs function here
const { User, Admin } = require("./models/userSchema");
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
    "https://swift-pay-money-transfer.netlify.app",
  ], // Allowed origins
  credentials: true, // Enable credentials (cookies, authorization headers, etc.)
  optionsSuccessStatus: 200,
};

// ---------------------------------- Middleware ----------------------------------

// upload via multer --------------------------------------------------------------
const folder = "./uploadsProfilePic/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    // control file name like -> important file.png => important-file-time(forUni).png
    const fileExt = path.extname(file?.originalname); 
    const filename =
      (file.originalname 
        ? file.originalname
            .replace(fileExt, "") // here your file name will be -> important file
            .toLowerCase()
            .split(" ") // split by spaces, split return array -> ['important', 'file']
            .join("-") // // join with hyphen -> important-file
        : "unknown-file") + // if file name is nothing
      "-" +
      Date.now(); // Add timestamp -> important-file-123456
    cb(null, filename + fileExt); // here filename and fileExt -> important-file-123456.png
  },
});

let upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1000 byte = 1 kb, 1000 kb and = 1 MB
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only .jpg, .png, or .jpeg formats are allowed!"));
    }
  },
});
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

// Admin login route
app.post("/loginAdmin", loginAdmin);

// route to create a new user
app.use(createUser);
app.use(createAgent);

// profile image upload
app.post("/profile-img", upload.single("profile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  // Optionally, handle or rename/move the file here
  res.status(200).send("File uploaded successfully!");
});

// Route handler for the root URL (for testing server)
app.get("/", (req, res) => {
  res.status(500).send("swiftPay server is ready");
});

// --------------------------------- Error handling ---------------------------------
// --------------------------------- Error handling ---------------------------------
app.use((err, req, res, next) => {
  if (err) {
    if (err instanceof multer.MulterError) {
      res.status(500).send("There was an uploaded error !! ");
    } else {
      res.status(500).json({
        message: err.message || "Internal Server Error",
        error: err, // optional, remove in production for security reasons
      });
    }
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
