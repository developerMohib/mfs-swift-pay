
import bcrypt from 'bcryptjs';

// make password hash for sign up
const hashPassword = async (plainPass : string) => {
  const salt = await bcrypt.genSalt(10); // to make 10 hasing pass
  const hashedPass = await bcrypt.hash(plainPass, salt);
  return hashedPass;
};

// compare password for login
const comparePassword = async (plainPass :string, hashPassword : string) => {
  // Compare plain password with hashed one
  const isMatch = await bcrypt.compare(plainPass, hashPassword);
  return isMatch;
};

export { hashPassword, comparePassword };