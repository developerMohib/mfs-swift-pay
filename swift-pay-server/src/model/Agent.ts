import { Schema, model } from 'mongoose';

export interface IAgent {
  userName: string;
  userPhone: string;
  userEmail: string;
  userNID: string;
  password: string;
  balance: number;
  income: number;
  userPhoto?: string;
  userRole: 'user' | 'agent' | 'admin';
  status: 'active' | 'block' | 'pending';
  transactions: Schema.Types.ObjectId[];
}

const agentSchema = new Schema<IAgent>(
  {
    userName: { type: String, required: true },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userNID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    income: { type: Number, default: 0 },
    userPhoto: {
      type: String,
      default: 'https://avatars.githubusercontent.com/u/92154638?v=4',
    },
    userRole: {
      type: String,
      enum: ['user', 'agent', 'admin'],
      default: 'agent',
    },
    status: {
      type: String,
      enum: ['active', 'block', 'pending'],
      default: 'pending',
    },
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }],
  },
  { timestamps: true },
);

export const Agent = model<IAgent>('Agent', agentSchema);
