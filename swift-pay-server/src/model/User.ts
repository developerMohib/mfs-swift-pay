import { Schema, model } from 'mongoose';

export interface IUser {
  userName: string;
  userPhone: string;
  userEmail: string;
  userNID: string;
  password: string;
  balance: number;
  userRole: 'user' | 'agent' | 'admin';
  status: 'active' | 'block' | 'pending';
  transactions: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  userName: { type: String, required: true },
  userPhone: { type: String, required: true, unique: true },
  userEmail: { type: String, required: true, unique: true },
  userNID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 40 },
  userRole: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
  status: {
    type: String,
    enum: ['active', 'block', 'pending'],
    default: 'active',
  },
  transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
});

export const User = model<IUser>('User', userSchema);
