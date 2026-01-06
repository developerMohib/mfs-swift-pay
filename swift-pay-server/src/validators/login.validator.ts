import { LoginDTO } from '../constants/auth.types';

export const validateLogin = (data: LoginDTO): string | null => {
  const { identifier, password } = data;

  // Trim inputs early
  const trimmedIdentifier = identifier?.trim();
  const trimmedPassword = password?.trim();

  // Check if fields are provided
  if (!trimmedIdentifier || !trimmedPassword) {
    return 'Phone/Email and PIN are required';
  }

  // Validate identifier: email OR phone
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;
  
  const isValidEmail = emailRegex.test(trimmedIdentifier);
  const isValidPhone = phoneRegex.test(trimmedIdentifier.replace(/\D/g, ''));

  if (!isValidEmail && !isValidPhone) {
    return 'Invalid email or phone number format';
  }

  // Validate PIN: 5-8 digits only
  if (!/^\d{5,8}$/.test(trimmedPassword)) {
    return 'Only 5-8 digit PIN is allowed';
  }

  return null;
};