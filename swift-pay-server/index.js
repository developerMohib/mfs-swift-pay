const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Initialize the Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MongoDB_url)
  .then(() => {
    console.log("MongoDB connection successful !");
  })
  .catch((err) => {
    console.error("Uhu, MongoDB connection error:", err);
  });

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

// middle ware
app.use(cors(corsOptions));

// upload via multer
const folder = "./public/profileImages/";
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

// Import route files
const createUserRoute = require("./Routes/user.routes");
const createAgentRoute = require("./Routes/agent.routes");
const adminRoute = require("./Routes/admin.routes");
const alluserRoute = require("./Routes/user.routes");
const allAgentRoute = require("./Routes/agent.routes");
const loginUserRoute = require("./Routes/user.routes");

// controller function files
const { loginAdmin } = require("./controllers/admin.controller");

// Define API routes
app.use("/register", createUserRoute);

app.use("/login", loginUserRoute);
app.use("/all", alluserRoute);

app.use("/agent", createAgentRoute);
app.use("/all", allAgentRoute);

app.use("/admin", adminRoute);

// Profile image upload route
app.post("/profile-img", upload.single("profile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const imgUrl = `./public/profileImages/${req.file.filename}`;
  res.status(200).send({
    message: "File uploaded successfully!",
    fileUrl: imgUrl,
  });
});


// Test route to check server status
app.get("/", (req, res) => {
  res.status(200).send("swiftPay server is ready");
});

// -------------------- Error Handling --------------------
app.use((err, req, res, next) => {
  console.error(err); // Log error for debugging
  if (err instanceof multer.MulterError) {
    return res.status(500).send("There was an upload error!!");
  }
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
});


// Global Error Handling Middleware
app.use("*", (req, res, next) => {
  const error = new Error(`Cannot find ${req.originalUrl} on this server!`);
  error.status = 404;
  next(error);
});
// Error handling middleware (Handles all errors)
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});


// -------------------- Server Setup --------------------
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`swiftPay server is listening on port ${port}`);
});