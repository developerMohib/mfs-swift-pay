import { Request, Response } from 'express';
import { Admin } from '../model/Admin';
import { comparePassword } from '../middleware/authMiddleware';
import { Agent } from '../model/Agent';
import { Transaction } from '../model/Transaction';

export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ userEmail: email });

    if (!admin) {
      res.status(400).json({ message: 'Admin not found' });
      return;
    }

    // Verify pin
    const isMatch = await comparePassword(password, admin.password);
    console.log(19, isMatch);

    // if (!isMatch) {
    //   res.status(400).json({ message: 'Invalid credentials' });
    //   return;
    // }

    // Generate JWT token
    // const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

    res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const result = await Admin.find().select(
      'userName userPhone userRole userEmail',
    );
    res.send(result);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const balanceInSystem = async (req: Request, res: Response) => {
  try {
    const admin = await Admin.findOne();
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    res.status(200).json({
      balance: admin.balance,
      totalMoneyInSystem: admin.totalMoneyInSystem,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const agentCashInRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { senderId, receiverId, amount, password } = req.body;
    const agent = await Agent.findById(senderId);

    if (!senderId || !receiverId || !amount || amount < 50) {
      res.status(400).json({ error: 'Invalid input' });
      return;
    }
    if (!agent) {
      res.status(404).json({ error: 'Agent not found' });
      return;
    }
    const isMatch = await comparePassword(password, agent.password);
    console.log('is match', isMatch);

    const adminId = process.env.ADMIN_ID; // mongose object id
    // Add fee to admin's balance
    if (adminId) {
      const admin = await Admin.findOne({ _id: new Object(adminId) });
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
