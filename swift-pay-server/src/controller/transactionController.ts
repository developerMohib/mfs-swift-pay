import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../model/User';
import { Transaction } from '../model/Transaction';
import { Admin } from '../model/Admin';
import { comparePassword } from '../middleware/authMiddleware';
import { Agent } from '../model/Agent';

export const sendMoney = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { senderId, recipientPhone, amount, pin } = req.body;

  try {
    // Validate required fields and amount
    if (
      !senderId ||
      !recipientPhone ||
      !pin ||
      !amount ||
      isNaN(amount) ||
      amount < 50
    ) {
      await session.abortTransaction();
      res.status(400).json({
        success: false,
        error: 'Invalid input: amount must be ≥ 50 and all fields required',
      });
      return;
    }

    // Find sender and receiver in parallel
    const [sender, receiver] = await Promise.all([
      User.findById(senderId).session(session),
      User.findOne({ userPhone: recipientPhone }).session(session),
    ]);

    if (!sender) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Sender not found' });
      return;
    }

    if (!receiver) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Receiver not found' });
      return;
    }

    if (sender._id.toString() === receiver._id.toString()) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Cannot send money to yourself' });
      return;
    }

    // Calculate fee and total deduction
    const fee = amount >= 100 ? 5 : 0;
    const totalDeduction = amount + fee;

    // Check sender balance
    if (sender.balance < totalDeduction) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    // Update balances
    sender.balance -= totalDeduction;
    receiver.balance += amount;

    // Create transaction record
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      fee,
      type: 'send-money',
      status: 'success',
    });

    // Save transaction and update user transaction histories
    await transaction.save({ session });

    sender.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );
    receiver.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );

    // Save sender and receiver (balances + transaction history)
    await Promise.all([sender.save({ session }), receiver.save({ session })]);

    // Add fee to admin balance if configured
    const adminId = process.env.ADMIN_ID;
    if (fee >= 0 && adminId) {
      const admin = await Admin.findById(adminId).session(session);
      if (admin) {
        admin.balance += fee;
        await admin.save({ session });
      } else {
        res
          .status(404)
          .json({
            success: false,
            error: 'Admin not found for fee allocation',
          });
        return;
      }
    }
    await session.commitTransaction();
    return res.status(200).json({
      message: 'Send Money successfully',
      transaction,
      remainingBalance: sender.balance,
    });
  } catch (err) {
    await session.abortTransaction();
    console.error('Send money failed:', err); // Optional logging
    return res.status(500).json({
      error: 'Send money failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  } finally {
    session.endSession();
  }
};

export const cashDeposit = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { senderId, receiverId, amount } = req.body;

    // Validate input minimum 50
    if (!senderId || !receiverId || !amount || amount < 50) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Find sender and receiver
    const sender = await Agent.findOne({ _id: new Object(senderId) }).session(
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
    // Check sender balance

    if (sender.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Insufficient balance' });
      return;
    }

    // Deduct amount + fee from sender
    sender.balance = sender.balance - amount;
    await sender.save({ session });

    // Add amount to receiver
    receiver.balance = receiver.balance + amount;
    await receiver.save({ session });

    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'cash-in', // Set transaction type
      status: 'success', // Set transaction status
    });
    await transaction.save({ session });

    // Update sender and receiver transaction history
    sender.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );
    receiver.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );

    await sender.save({ session });
    await receiver.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: 'Money deposit successfully',
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

export const cashInFromAgent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { senderId, receiverId, amount, password } = req.body;
  // Validate input
  if (!senderId || !receiverId || !amount) {
    await session.abortTransaction();
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  try {
    // Find sender and receiver
    const sender = await User.findOne({ _id: new Object(senderId) }).session(
      session,
    );
    const receiver = await Agent.findOne({ userPhone: receiverId }).session(
      session,
    );

    if (!sender || !receiver) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Sender or receiver not found' });
      return;
    }

    const isMatch = await comparePassword(password, sender.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid PIN not found' });
      return;
    }
    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'cash-in', // Set transaction type
      status: 'pending', // Set transaction status
    });
    await transaction.save({ session });

    // Update sender and receiver transaction history
    sender.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );
    receiver.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Cash In Request successfully',
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

export const cashOutFromAgent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { senderId, receiverId, amount, password } = req.body;

    // Validate input
    if (!senderId || !receiverId || !amount) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Find sender and receiver
    const sender = await User.findOne({ _id: new Object(senderId) }).session(
      session,
    );

    if (!sender) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Sender not found' });
      return;
    }

    const isMatch = await comparePassword(password, sender.password);
    if (!isMatch) {
      res
        .status(400)
        .json({ success: false, message: 'Invalid PIN not found' });
      return;
    }

    // find agent
    const receiver = await Agent.findOne({ userPhone: receiverId }).session(
      session,
    );
    if (!receiver) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Receiver not found' });
      return;
    }

    // Fee Calculation
    const totalFee = amount * (1.5 / 100); // 1.5% of amount
    const agentFee = amount * (1 / 100); // 1% to agent
    const adminFee = amount * (0.5 / 100); // 0.5% to admin
    const finalAmount = amount - totalFee; // Amount user receives from agent
    // const income = totalFee - adminFee;
    // Check sender balance
    // find Admin
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

      admin.balance += adminFee;
      await admin.save({ session });
    }

    // Update balances
    sender.balance -= amount; // Deduct full amount from user
    receiver.balance += finalAmount; // Add final amount to agent
    receiver.income += agentFee; // Update agent's income

    // Save changes
    await sender.save();
    await receiver.save();

    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'cash-out', // Set transaction type
      status: 'success', // Set transaction status
    });
    await transaction.save({ session });

    // Update sender and receiver transaction history
    sender.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );
    receiver.transactions.push(
      transaction._id as unknown as mongoose.Schema.Types.ObjectId,
    );

    await sender.save({ session });
    await receiver.save({ session });

    await session.commitTransaction();

    res.status(200).json({
      message: 'Cash out successfully',
      transaction,
      remainingBalance: sender.balance,
    });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({
      error: 'Cash out transaction failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  } finally {
    session.endSession();
  }
};

export const allTransaction = async (req: Request, res: Response) => {
  try {
    const result = await Transaction.find()
      .populate('sender', 'userName userPhone userEmail userRole') // Fetch sender details
      .populate('receiver', 'userName userPhone userEmail userRole');

    res.status(200).json({
      message: 'All transaction retrive successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      error: 'All transaction failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  }
};
