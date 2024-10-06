const express = require("express");
const router = express.Router();
const { Agent } = require("../models/userSchema");
const { hashPassword } = require("../authHelper/authHelpler");

// POST route to create a new user
router.post("/registerAgent", async (req, res) => {
  try {
    const {
      userName,
      userEmail,
      password,
      userPhone,
      userNID,
      userRole,
      status,
    } = req.body;

    const hashedPassword = await hashPassword(password);
    const userData = {
      userName,
      userEmail,
      password: hashedPassword, // hashed pass to store in db
      userPhone,
      userNID,
      userRole,
      status,
      cash: 0,
    };

    // Check if the email already exists in the database
    const query = { $or: [{ userEmail: userEmail }, { userPhone: userPhone }] };

    const existingUser = await Agent.findOne(query);

    if (existingUser) {
      const usedEmail =
        existingUser?.userEmail === userEmail ? userEmail : null;
      const usedPhone =
        existingUser?.userPhone === userPhone ? userPhone : null;
      const usedValue = usedEmail || usedPhone;

      // If email already exists, send an error response
      return res
        .status(400)
        .send({
          error: `${usedValue} already in use. Please use a different ${usedValue}.`,
        });
    }

    // Create a new user
    const newUser = new Agent (userData);

    // Save the user to the database
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .send({ error: "Failed to create user", details: error.message });
  }
});
module.exports = router;