import { NextFunction, Request, Response } from 'express';
import { User } from '../model/User';

export const allUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await User.find(); // Fetch all users
    res.send(users); // Send the users back as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error });
    next(error);
  }
};
