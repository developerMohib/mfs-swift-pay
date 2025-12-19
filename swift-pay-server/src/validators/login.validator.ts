import { LoginDTO } from "../constants/auth.types";

// validators/login.validator.ts
export const validateLogin = (data: LoginDTO): string | null => {
    const { identifier, password } = data;
   if (!identifier || !password) {
    return 'Identifier and password required';
  }

  if (password.length < 4 || password.length > 20) {
    return 'Invalid password length';
  }
  return null;
};
