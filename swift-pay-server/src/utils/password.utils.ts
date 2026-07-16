import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password/PIN before saving to the database.
 */
export const hashPassword = async (plainPass: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(plainPass, salt);
  return hashedPass;
};

/**
 * Compare a plain text password/PIN against a stored bcrypt hash.
 */
export const comparePassword = async (
  plainPass: string,
  hashedPassword: string,
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(plainPass, hashedPassword);
  return isMatch;
};