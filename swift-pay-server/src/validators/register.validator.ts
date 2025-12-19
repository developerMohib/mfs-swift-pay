// validators/register.validator.ts
import { RegisterDTO } from '../constants/auth.types';
import { USER_ROLES } from '../constants/roles';

export const validateRegister = (data: RegisterDTO): string | null => {
  const { userName, userEmail, password, userPhone, userNID, role } = data;

  if (!userName || !userEmail || !password || !userPhone || !userNID) {
    return 'Required fields missing';
  }

  if (!Object.values(USER_ROLES).includes(role)) {
    return 'Invalid role';
  }

  if (password.length < 4 || password.length > 20) {
    return 'Password length must be between 4 and 20 characters';
  }

  return null;
};
