// user modes js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
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
  },
  userNID: {
    type: String,
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

// Create the model based on the schema
const User = mongoose.model("User", userSchema);
module.exports = User;
