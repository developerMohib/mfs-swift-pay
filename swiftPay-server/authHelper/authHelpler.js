const bcrypt = require("bcryptjs");

// make password hash for sign up
const hashPassword = async (plainPass) => {
  const salt = await bcrypt.genSalt(10); // to make 10 hasing pass
  const hashedPass = await bcrypt.hash(plainPass, salt);
  return hashedPass;
};

// compare password for login
const comparePassword = async (plainPass, hashPassword) => {
  // Compare plain password with hashed one
  const isMatch = await bcrypt.compare(plainPass, hashPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };
