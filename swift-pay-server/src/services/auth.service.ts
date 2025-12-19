import { Model } from 'mongoose';
import { USER_ROLES, UserRole } from '../constants/roles';
import { comparePassword, hashPassword } from '../middleware/authMiddleware';
import { Admin } from '../model/Admin';
import { Agent } from '../model/Agent';
import { User } from '../model/User';
import { generateToken } from '../utils/jwt';
import { RegisterDTO } from '../constants/auth.types';

const MODELS: Model<any>[] = [User, Agent, Admin];

export const checkDuplicate = async (
  email?: string,
  phone?: string,
  nid?: string,
) => {
  for (const Model of MODELS) {
    const found = await Model.findOne({
      $or: [
        email ? { userEmail: email } : {},
        phone ? { userPhone: phone } : {},
        nid ? { userNID: nid } : {},
      ],
    });

    if (found) return { exists: true };
  }

  return { exists: false };
};

const ROLE_MODEL_MAP: Record<UserRole, any> = {
  user: User,
  agent: Agent,
  admin: Admin,
};

// REGISTER
export const registerService = async (data: RegisterDTO) => {
  const Model = ROLE_MODEL_MAP[data.role];

  const user = await Model.create({
    ...data,
    password: await hashPassword(data.password),
    status: data.role === USER_ROLES.AGENT ? 'pending' : 'active',
    balance: data.role === USER_ROLES.USER ? 40 : 0,
  });

  return user;
};

// LOGIN
export const loginService = async (identifier: string, password: string) => {
  for (const Model of Object.values(ROLE_MODEL_MAP)) {
    const user = await Model.findOne({
      $or: [{ userEmail: identifier }, { userPhone: identifier }],
    });

    if (user && (await comparePassword(password, user.password))) {
      const token = generateToken({
        id: user._id,
        role: user.role,
        status: user.status,
      });

      return { user, token };
    }
  }

  return null;
};
