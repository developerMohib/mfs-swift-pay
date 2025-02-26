import { NextFunction, Request, Response } from 'express';
import { Agent } from '../model/Agent';

export const allAgent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await Agent.find(); // Fetch all users
    res.send(users); // Send the users back as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
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

    // Update user status
    const updatedUser = await Agent.findByIdAndUpdate(
      id,
      { status },
      { new: true }, // Return the updated document
    );

    // Check if user exists
    if (!updatedUser) {
      res.status(404).json({ message: 'Agent not found' });
      return;
    }

    // Send success response
    res.status(200).json({
      message: `Agent status updated to ${status}`,
      user: updatedUser,
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};
