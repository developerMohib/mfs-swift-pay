import { IUser } from "../model/User";

// Registration DTO
export interface RegisterDTO {
  userName: string;
  userEmail: string;
  password: string;
  userPhone: string;
  userNID: string;
  role: 'user' | 'agent' | 'admin';
}

// Login DTO
export interface LoginDTO {
  identifier: string;
  password: string;
}

// Token Payload
export interface TokenPayload {
  id: string;
  role: 'user' | 'agent' | 'admin';
  status: 'active' | 'block' | 'pending';
}

// Duplicate Check Result
export interface DuplicateResult {
  exists: boolean;
  field?: 'userEmail' | 'userPhone' | 'userNID';
  message?: string;
}

// Login Result
export interface LoginResult {
  user: Omit<IUser, 'password'>;
  token: string;
}