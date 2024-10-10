const { User } = require("../models/userSchema");
const { hashPassword } = require("../authHelper/authHelpler");
const { comparePassword } = require("../authHelper/authHelpler");

const createUser = async (req, res, next) => {
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

    const existingUser = await User.findOne(query);

    if (existingUser) {
      const usedEmail =
        existingUser?.userEmail === userEmail ? userEmail : null;
      const usedPhone =
        existingUser?.userPhone === userPhone ? userPhone : null;
      const usedValue = usedEmail || usedPhone;

      // If email already exists, send an error response
      return res.status(400).send({
        error: `${usedValue} already in use. Please use a different ${usedValue}.`,
      });
    }

    // Create a new user
    const newUser = new User(userData);

    // Save the user to the database
    await newUser.save();
    res
      .status(200)
      .send({ message: "User created successfully", user: newUser });
  } catch (error) {
    res
      .status(400)
      .send({ error: "Failed to create user", details: error.message });
    next(error);
  }
};

const loginUser = async (req, res, next) => {
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
    res.status(500).json({
      message: "Authentication failed, log in error.",
      error: error.message,
    });
    next(error);
  }
};
const allUser = async (req, res, next) => {
  try {
    const users = await User.find(); // Fetch all users
    res.send(users); // Send the users back as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
    next(error);
  }
};
module.exports = { createUser, allUser, loginUser };
