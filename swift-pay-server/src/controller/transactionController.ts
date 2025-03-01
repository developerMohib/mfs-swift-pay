import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../model/User';
import { Transaction } from '../model/Transaction';
import { Admin } from '../model/Admin';

export const sendMoney = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { senderId, receiverId, amount } = req.body;
    // Validate input
    if (!senderId || !receiverId || !amount || amount < 50) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Find sender and receiver
    const sender = await User.findOne({ _id: new Object(senderId) }).session(
      session,
    );
    const receiver = await User.findOne({ userPhone: receiverId }).session(
      session,
    );

    if (!sender || !receiver) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Sender or receiver not found' });
      return;
    }

    // Calculate fee (5 Taka if amount > 100)
    const fee = amount > 100 ? 5 : 0;
    const totalAmount = amount + fee;

    // Check sender balance

    if (sender.balance < totalAmount) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    // Deduct amount + fee from sender
    sender.balance = sender.balance - totalAmount;
    await sender.save({ session });

    // Add amount to receiver
    receiver.balance = receiver.balance + amount;
    await receiver.save({ session });

    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      fee,
      type: 'send-money', // Set transaction type
      status: 'success', // Set transaction status
    });
    await transaction.save({ session });

    const adminId = process.env.ADMIN_ID; // mongose object id
    // Add fee to admin's balance
    if (adminId) {
      const admin = await Admin.findOne({ _id: new Object(adminId) }).session(
        session,
      );
      if (!admin) {
        await session.abortTransaction();
        res.status(404).json({ error: 'Admin not found' });
        return;
      }

      admin.balance += fee;
      await admin.save({ session });
    }

    await session.commitTransaction();

    res.status(200).json({
      message: 'Money sent successfully',
      transaction,
      remainingBalance: sender.balance,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      error: 'Registration failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  } finally {
    session.endSession();
  }
};
