import { NextFunction, Request, Response } from 'express';
import { User } from '../model/User';
import { Transaction } from '../model/Transaction';
import mongoose from 'mongoose';
import { Agent } from '../model/Agent';
import { Admin } from '../model/Admin';

export const allUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json({
        success: true,
        message: 'Users fetched successfully',
        data: users,
      });
  } catch (error) {
    console.error('Error fetching users:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
    next(error);
  }
};

export const getLoginUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Validate if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    let user = null;

    // Check in User collection
    user = await User.findById(id);

    // If not found, check in Admin collection
    if (!user) {
      user = await Admin.findById(id);
    }

    // If not found, check in Agent collection
    if (!user) {
      user = await Agent.findById(id);
    }

    // If user is still not found
    if (!user) {
      res
        .status(404)
        .json({ error: 'You are not registered user yet, please register' });
      return;
    }

    // Return the user and the type (User, Admin, or Agent)
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to retrieve user',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  }
};

export const updateStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Validate input
    if (!id || !status) {
      res.status(400).json({ message: 'User ID and status are required' });
      return;
    }

    // Update user status
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // Return the updated document
    );

    // Check if user exists
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Send success response
    res.status(200).json({
      message: `User status updated to ${status}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

export const userTransaction = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Fetch last 100 transactions for the user (sorted by latest)
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(100);

    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};
