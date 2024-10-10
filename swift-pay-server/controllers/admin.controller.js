const { comparePassword } = require("../authHelper/authHelpler");
const { Admin } = require("../models/userSchema");

// log in admin
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("email", email, password);

    // Step 1: Find the admin by email
    const admin = await Admin.findOne({ userEmail: email });
    if (!admin) {
      return res.status(401).json({ message: "Admin not found!" });
    }

    // Step 2: Compare passwords
    const isPassValid = await comparePassword(password, admin.password);
    if (!isPassValid) {
      return res.status(401).json({
        message: "invalid password",
      });
    }

    // Step 3: Create a token (JWT) for authentication
    // Step 4: Send success response
    res.status(200).json({
      message: "log in successfull",
      user: {
        userName: admin.userName,
        userEmail: admin.userEmail,
        userRole: admin.userRole,
        userPhoto: admin.userPhoto,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Admin Authentication failed, log in error.",
      error: error.message,
    });
    next(error);
  }
};

const getAdmin = async (req, res, next) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins); // Send the users back as a JSON response
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
    next(error);
  }
};

module.exports = { loginAdmin, getAdmin };
