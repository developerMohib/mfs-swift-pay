import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/User';
import { Agent } from '../model/Agent';
import { comparePassword, hashPassword } from '../middleware/authMiddleware';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { userName, userEmail, password, userPhone, userNID, userRole } =
    req.body;

  // Validate required fields
  if (
    !userName ||
    !userEmail ||
    !password ||
    !userPhone ||
    !userNID ||
    !userRole
  ) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    // Hash the password
    const hashedPin = await hashPassword(password);

    // Prepare user data
    const userData = {
      userName,
      userPhone,
      userEmail,
      userNID,
      password: hashedPin,
      userRole,
      balance: userRole === 'user' ? 40 : 100000, // 40 Taka for users, 100,000 Taka for agents
      status: userRole === 'agent' ? 'pending' : 'active', // Agents need approval
    };

    // Check if the email, phone, or NID already exists
    const query = {
      $or: [
        { userEmail: userEmail },
        { userPhone: userPhone },
        { userNID: userNID },
      ],
    };

    const existingUser = await User.findOne(query);
    const existingAgent = await Agent.findOne(query);

    if (existingUser || existingAgent) {
      const usedEmail =
        existingUser?.userEmail === userEmail ||
        existingAgent?.userEmail === userEmail
          ? userEmail
          : null;
      const usedPhone =
        existingUser?.userPhone === userPhone ||
        existingAgent?.userPhone === userPhone
          ? userPhone
          : null;
      const usedNID =
        existingUser?.userNID === userNID || existingAgent?.userNID === userNID
          ? userNID
          : null;
      const usedValue = usedEmail || usedPhone || usedNID;

      res.status(400).json({
        error: `${usedValue} is already in use. Please use a different ${usedValue}.`,
      });
      return;
    }

    // Create a new user or agent based on the role
    const newUser =
      userRole === 'user' ? new User(userData) : new Agent(userData);
    await newUser.save();

    res.status(201).json({ message: 'Registration successful', user: newUser });
  } catch (err) {
    res.status(500).json({
      error: 'Registration failed',
      details: err instanceof Error ? err.message : 'An unknown error occurred',
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { phoneOrEmail, pin } = req.body;
  if (!phoneOrEmail || !pin) {
    res.status(400).json({ error: 'Missing phone Email or pin' });
    return;
  }
  try {
    const [user, agent] = await Promise.all([
      User.findOne({
        $or: [{ userEmail: phoneOrEmail }, { userPhone: phoneOrEmail }],
      }),
      Agent.findOne({
        $or: [{ userEmail: phoneOrEmail }, { userPhone: phoneOrEmail }],
      }),
    ]);

    const account = user ?? agent;

    if (!account || !(await comparePassword(pin, account.password))) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    // const token = jwt.sign(
    //   { id: account._id, role: account.userRole },
    //   process.env.JWT_SECRET as string,
    //   { expiresIn: '1h' },
    // );

    res.status(200).json({
      message: 'Login successful',
      user: account, // Send userRole to frontend
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ error: 'Login failed', details: err.message });
    } else {
      res
        .status(400)
        .json({ error: 'Login failed', details: 'something wrong' });
    }
  }
};
