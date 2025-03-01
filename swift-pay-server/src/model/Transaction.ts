import { Schema, model } from 'mongoose';

export interface ITransaction {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  amount: number;
  fee: number;
  type: 'send-money' | 'cash-in' | 'cash-out';
  status: 'success' | 'failed' | 'pending';
}

const transactionSchema = new Schema<ITransaction>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    type: {
      type: String,
      enum: ['send-money', 'cash-in', 'cash-out'],
      required: true,
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Transaction = model<ITransaction>(
  'Transaction',
  transactionSchema,
);
