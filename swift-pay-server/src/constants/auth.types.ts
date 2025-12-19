import { UserRole } from "./roles";

export interface RegisterDTO {
  userName: string;
  userEmail: string;
  password: string;
  userPhone: string;
  userNID: string;
  role: UserRole;
}
// types/auth.types.ts
export interface LoginDTO {
  identifier: string;
  password: string;
}
