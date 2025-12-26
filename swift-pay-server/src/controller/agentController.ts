import { NextFunction, Request, Response } from 'express';
import { Agent } from '../model/Agent';
import { Transaction } from '../model/Transaction';
import { User } from '../model/User';

export const allAgent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const agents = await Agent.find(); // Fetch all agents
    res.status(200).json({
      success: true,
      message: 'Agents fetched successfully',
      data: agents,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching agents', error });
    next(error);
  }
};

export const pendingApprovedBlockAgent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status = req?.params.status;
    const agents = await Agent.find({ status })
      .select('-password')
      .sort({ createdAt: -1 }); // Optional: newest first

    res.status(200).json({
      success: true,
      message: `${status} agents fetched successfully`,
      data: agents,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: 'Error fetching agents', error });
    next(error);
  }
};

export const updateStatusAgent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Validate input
    if (!id || !status) {
      res.status(400).json({ message: 'Agent ID and status are required' });
      return;
    }
    // Find the agent by ID
    const agent = await Agent.findById(id);
    if (!agent) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }
    if (agent.status === status) {
      res.status(400).json({ message: `Agent is already ${status}` });
      return;
    }
    const shouldAddBonus = agent.status === 'pending' && status === 'active';
    if (shouldAddBonus) {
      agent.balance = (agent.balance || 0) + 100000;
    }
    agent.status = status;
    await agent.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: `Agent status updated to ${status}`,
      data: {
        id: agent._id,
        userName: agent.userName,
        userPhone: agent.userPhone,
        status: agent.status,
        balance: agent.balance,
      },
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({
      message: 'Error updating user status',
      error: (error as Error).message,
    });
  }
};

export const getPendingCashInRequests = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // const agentId = req;user?.id;

    const pendingRequests = await Transaction.find({
      status: 'pending',
      type: 'cash-in',
    });

    if (!pendingRequests.length) {
      res.status(404).json({ message: 'No pending cash-in requests found' });
      return;
    }

    res.status(200).json({
      message: 'Pending cash-in requests retrieved successfully',
      data: pendingRequests,
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

export const cashInOkayAgent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!id || !status) {
      res
        .status(400)
        .json({ message: 'Transaction ID and status are required' });
      return;
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    if (transaction.status !== 'pending') {
      res
        .status(400)
        .json({ message: 'This transaction has already been processed' });
      return;
    }

    const agent = await Agent.findById(transaction.receiver);
    const user = await User.findById(transaction.sender);

    if (!agent || !user) {
      res.status(404).json({ message: `${agent} ${user} not found` });
      return;
    }

    if (status === 'approved') {
      if (agent.balance < transaction.amount) {
        res
          .status(400)
          .json({ message: "Insufficient balance in agent's account" });
        return;
      }
      // Deduct from agent balance
      agent.balance -= transaction.amount;

      // Add to user's balance
      user.balance = (user.balance || 0) + transaction.amount;

      // Update transaction status
      transaction.status = 'success';

      // Save updates
      await agent.save();
      await user.save();
      await transaction.save();

      res.status(200).json({ message: 'Transaction approved successfully' });
    } else if (status === 'rejected') {
      // If rejected, no changes, just update the transaction status
      transaction.status = 'failed';
      await transaction.save();

      res.status(200).json({ message: 'Transaction rejected' });
    } else {
      res.status(200).json({ message: 'Transaction something wrong' });
    }
  } catch (error) {
    console.error('Error updating transaction status:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};
