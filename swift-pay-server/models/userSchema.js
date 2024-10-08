const mongoose = require("mongoose");

// Define the common schema fields
const baseSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true, // Removes spaces from the beginning and end of the string
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userPhone: {
    type: String,
    unique: true,
  },
  userNID: {
    type: String,
    unique: true,
  },
  userRole: {
    type: String,
  },
  status: {
    type: String,
  },
  isVerified: {
    type: String,
  },
  cash: {
    type: String,
  },
  userPhoto: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create specific schemas for different roles
const userSchema = new mongoose.Schema({});
const agentSchema = new mongoose.Schema({});
const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
  },
  userPhoto: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
});

// Extend the base schema for users and agents
userSchema.add(baseSchema);
agentSchema.add(baseSchema);

// Create the model based on the schema
const User = mongoose.model("User", userSchema);
const Agent = mongoose.model("Agent", agentSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { User, Agent, Admin };
