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
    console.log(24, status)
    // Validate input
    if (!id || !status) {
      res.status(400).json({ message: "Agent ID and status are required" });
      return;
    }
    // Find the agent by ID
    const agent = await Agent.findById(id);
    
    if (!agent) {
      res.status(404).json({ message: "Agent not found" });
      return;
    }

    // Check if the agent is new and status is being updated to "approved"
    let bonusAdded = false;
    if (agent.status === "pending" && status === "active") {
      agent.balance = (agent.balance || 0) + 100000; // Add first-time bonus
      bonusAdded = true;
    }

    // Update agent status
    agent.status = status;
    await agent.save();

    // Send success response
    res.status(200).json({
      message: `Agent status updated to ${status}`,
      bonusAdded: bonusAdded ? 100000 : 0, // Indicate if bonus was added
      user: agent,
    });
  }catch (error) {
    console.error('Error updating user status:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};