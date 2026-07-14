import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Admin } from '../model/Admin';
import { comparePassword } from '../utils/password.utils';
import { Agent } from '../model/Agent';
import { Transaction } from '../model/Transaction';

export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const admin = await Admin.findOne({ userEmail: email }).select('+password');
    if (!admin) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      res.status(500).json({ message: 'Server configuration error' });
      return;
    }

    const token = jwt.sign(
      { id: admin._id.toString(), role: 'admin' },
      jwtSecret,
      { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'] },
    );

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    const adminResponse = {
      id: admin._id,
      userName: admin.userName,
      userEmail: admin.userEmail,
      userPhone: admin.userPhone,
      userRole: 'admin',
      balance: admin.balance,
    };

    res.status(200).json({
      message: 'Login successful',
      admin: adminResponse,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const result = await Admin.find().select(
      'userName userPhone userRole userEmail',
    );
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const balanceInSystem = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) {
      res.status(404).json({ message: 'Admin not found' });
      return;
    }

    res.status(200).json({
      balance: admin.balance,
      totalMoneyInSystem: admin.totalMoneyInSystem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: (error as Error).message });
  }
};

export const agentCashInRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { receiverId, amount, password } = req.body;
    // Trust the authenticated agent's own id, not a client-supplied senderId.
    const senderId = (req.user as { id?: string } | undefined)?.id;

    if (!senderId || !receiverId || !amount || amount < 50) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }

    const agent = await Agent.findById(senderId).select('+password');
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }

    const isMatch = await comparePassword(password, agent.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid password' });
      return;
    }

    const adminId = process.env.ADMIN_ID;
    if (adminId) {
      const admin = await Admin.findById(adminId);
      if (!admin) {
        res.status(404).json({ error: 'Admin not found' });
        return;
      }
    }

    const transaction = new Transaction({
      sender: agent._id,
      receiver: adminId,
      amount,
      type: 'cash-in', // Set transaction type
      status: 'pending', // Set transaction status
    });
    await transaction.save();

    res.status(200).json({
      message: 'Cash In Request successfully',
      transaction,
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};