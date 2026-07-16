import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../model/User';
import { Transaction } from '../model/Transaction';
import { Admin } from '../model/Admin';
import { Agent } from '../model/Agent';
import { comparePassword } from '../utils/password.utils';

export const sendMoney = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  const { recipientPhone, amount, pin } = req.body;
  // Trust the authenticated session, not a client-supplied senderId -
  // otherwise any logged-in user could pass someone else's id and
  // drain their account.
  const senderId = (req.user as { id?: string } | undefined)?.id;

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
      User.findById(senderId).select('+password').session(session),
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

    // Verify PIN before moving any money - this check was previously
    // missing, meaning any non-empty "pin" value was accepted.
    const isPinValid = await comparePassword(pin, sender.password);
    if (!isPinValid) {
      await session.abortTransaction();
      res.status(401).json({ success: false, error: 'Invalid PIN' });
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
    res.status(200).json({
      message: 'Send Money successfully',
      transaction,
      remainingBalance: sender.balance,
    });
    return ;
  } catch (err) {
    await session.abortTransaction();
    console.error('Send money failed:', err); // Optional logging
    res.status(500).json({
      error: 'Send money failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
    return 
  } finally {
    session.endSession();
  }
};

export const cashDeposit = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { receiverId, amount } = req.body;
    // Trust the authenticated agent's own id rather than a client-supplied
    // senderId, which previously let any agent drain another agent's balance.
    const senderId = (req.user as { id?: string } | undefined)?.id;

    // Validate input minimum 50
    if (!senderId || !receiverId || !amount || amount < 50) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Find sender and receiver
    const sender = await Agent.findById(senderId).session(session);
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

    // Deduct amount from sender, credit receiver
    sender.balance -= amount;
    receiver.balance += amount;

    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'cash-in', // Set transaction type
      status: 'success', // Set transaction status
    });
    await transaction.save({ session });

    // Update sender and receiver transaction history, then save both
    // balance + history changes exactly once, inside the transaction.
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
      error: 'Cash deposit failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  } finally {
    session.endSession();
  }
};

export const cashInFromAgent = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const { receiverId, amount, password } = req.body;
  // Trust the authenticated user's own id rather than a client-supplied senderId.
  const senderId = (req.user as { id?: string } | undefined)?.id;
  // Validate input
  if (!senderId || !receiverId || !amount) {
    await session.abortTransaction();
    res.status(400).json({ error: 'Invalid input' });
    return;
  }
  try {
    // Find sender and receiver
    const sender = await User.findById(senderId).select('+password').session(session);
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
      await session.abortTransaction();
      res.status(401).json({ success: false, message: 'Invalid PIN' });
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
      error: 'Cash-in request failed',
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
    const { receiverId, amount, password } = req.body;
    // Trust the authenticated user's own id rather than a client-supplied senderId.
    const senderId = (req.user as { id?: string } | undefined)?.id;

    // Validate input
    if (!senderId || !receiverId || !amount) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    // Find sender
    const sender = await User.findById(senderId).select('+password').session(session);

    if (!sender) {
      await session.abortTransaction();
      res.status(404).json({ error: 'Sender not found' });
      return;
    }

    const isMatch = await comparePassword(password, sender.password);
    if (!isMatch) {
      await session.abortTransaction();
      res
        .status(401)
        .json({ success: false, message: 'Invalid PIN' });
      return;
    }

    if (sender.balance < amount) {
      await session.abortTransaction();
      res.status(400).json({ error: 'Insufficient balance' });
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

    const adminId = process.env.ADMIN_ID;
    if (adminId) {
      const admin = await Admin.findById(adminId).session(session);
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

    // Record transaction
    const transaction = new Transaction({
      sender: sender._id,
      receiver: receiver._id,
      amount,
      type: 'cash-out', // Set transaction type
      status: 'success', // Set transaction status
    });
    await transaction.save({ session });

    // Update sender and receiver transaction history, then persist
    // balance + history changes exactly once, inside the transaction.
    // (Previously sender/receiver were saved twice - once outside the
    // session, breaking atomicity, then again inside it.)
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