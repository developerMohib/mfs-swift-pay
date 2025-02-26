import { NextFunction, Request, Response } from 'express';
import { User } from '../model/User';

export const allUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find(); // Fetch all users
    res.status(200).json(users); // Send the users back as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
    next(error);
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
