import { LoginDTO } from "../constants/auth.types";

// validators/login.validator.ts
export const validateLogin = (data: LoginDTO): string | null => {
    const { identifier, password } = data;
   if (!identifier) {
    return `Email or Phone is required`;
  }else if (!password) {
    return `Password is required`;
  }

  if (password.length < 4 || password.length > 20) {
    return 'Invalid password length';
  }
  return null;
};
