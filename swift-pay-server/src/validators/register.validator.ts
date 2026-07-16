import { Agent } from '../model/Agent';
import { User } from '../model/User';

export const validateRegistrationFields = (fields: {
  userName: string;
  userEmail: string;
  password: string;
  userPhone: string;
  userNID: string;
  userRole: string;
}): string | null => {
  const { userName, userEmail, password, userPhone, userNID, userRole } =
    fields;

  if (
    !userName ||
    !userEmail ||
    !password ||
    !userPhone ||
    !userNID ||
    !userRole
  ) {
    return 'All fields are required';
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(userEmail)) {
    return 'Invalid email format';
  }

  // Password strength validation
  if (password.length < 5 || password.length > 20) {
    return 'Password must be between 5 and 20 characters long';
  }

  // Phone number validation (basic)
  const phoneRegex = /^[0-9]{10,15}$/;
  if (!phoneRegex.test(userPhone)) {
    return 'Invalid phone number format';
  }

  // Role validation
  if (!['user', 'agent', 'admin', 'superadmin'].includes(userRole)) {
    return 'Invalid user role';
  }

  // NID validation (adjust based on your country)
  if ((userNID.length < 10) || (userNID.length > 17)) {
    return 'Invalid NID number';
  }
  return null;
};

// Check for existing fields in both User and Agent collections
export const findExistingRecords = async (
  email: string,
  phone: string,
  nid: string,
): Promise<{ exists: boolean; message?: string; field?: string }> => {
  const normalizedEmail = email.toLocaleLowerCase().trim();
  
  const [existingUser, existingAgent] = await Promise.all([
    User.findOne({
      $or: [
        { userEmail: normalizedEmail },
        { userPhone: phone },
        { userNID: nid },
      ],
    }),
    Agent.findOne({
      $or: [
        { userEmail: normalizedEmail },
        { userPhone: phone },
        { userNID: nid },
      ],
    }),
  ]);

  const existingRecord = existingUser || existingAgent;

  if (!existingRecord) {
    return { exists: false };
  }

  // Determine which field is duplicate
  if (existingRecord.userEmail === normalizedEmail) {
    return {
      exists: true,
      message: 'Email already registered',
      field: 'userEmail',
    };
  }

  if (existingRecord.userPhone === phone) {
    return {
      exists: true,
      message: 'Phone number already registered',
      field: 'userPhone',
    };
  }

  if (existingRecord.userNID === nid) {
    return {
      exists: true,
      message: 'NID already registered',
      field: 'userNID',
    };
  }

  return { exists: false };
};
