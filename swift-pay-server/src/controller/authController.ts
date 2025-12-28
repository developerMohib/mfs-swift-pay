import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/User';
import { Agent } from '../model/Agent';
import { comparePassword, hashPassword } from '../middleware/authMiddleware';
import {
  validateRegistrationFields,
  findExistingRecords,
} from '../validators/register.validator';
import { validateLogin } from '../validators/login.validator';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userName, userEmail, password, userPhone, userNID, userRole } =
      req.body;

    // Validation
    const validationError = validateRegistrationFields({
      userName,
      userEmail,
      password,
      userPhone,
      userNID,
      userRole,
    });

    if (validationError) {
      res.status(400).json({
        success: false,
        message: validationError,
      });
      return;
    }

    // Check for existing user/agent
    const existingRecords = await findExistingRecords(
      userEmail,
      userPhone,
      userNID,
    );

    if (existingRecords.exists) {
      res.status(409).json({
        success: false,
        message: existingRecords.message,
        field: existingRecords.field,
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Prepare user data
    const userData = {
      userName: userName.trim(),
      userEmail: userEmail.toLowerCase().trim(),
      userPhone: userPhone.trim(),
      userNID: userNID.trim(),
      password: hashedPassword,
      userRole,
      balance: userRole === 'user' ? 40 : 0,
      status: userRole === 'agent' ? 'pending' : 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create and save user
    const Model = userRole === 'user' ? User : Agent;
    const newUser = new Model(userData);
    await newUser.save();

    // Remove sensitive data from response
    const userResponse = {
      id: newUser._id,
      userName: newUser.userName,
      userEmail: newUser.userEmail,
      userPhone: newUser.userPhone,
      userNID: newUser.userNID,
      userRole: newUser.userRole,
      balance: newUser.balance,
      status: newUser.status,
    };

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: userResponse,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Handle specific error types
    if (error.name === 'ValidationError') {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.errors,
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Registration failed due to network',
      ...(process.env.NODE_ENV === 'development' && {
        error: error.message,
      }),
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { phoneOrEmail, pin } = req.body;
  try {
    // 1. Validate input
    const validationError = validateLogin({
      identifier: phoneOrEmail,
      password: pin,
    });
    if (validationError) {
      res.status(400).json({ success: false, message: validationError });
      return;
    }

    // 2. Normalize input
    const trimmedInput = phoneOrEmail.trim();
    const normalizedInput = trimmedInput.toLowerCase();
    const cleanPhone = trimmedInput.replace(/\D/g, ''); // Clean phone number
    const isEmail = normalizedInput.includes('@');

    // 3. Build optimized query
    const query = isEmail
      ? { userEmail: normalizedInput }
      : { $or: [{ userPhone: cleanPhone }, { userEmail: normalizedInput }] };

    // 4. Find user or agent
    const [user, agent] = await Promise.all([
      User.findOne(query).select('+password'),
      Agent.findOne(query).select('+password'),
    ]);

    const account = user || agent;
    if (!account) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // 5. Check account status
    if (account.status !== 'active') {
      const statusMessage =
        account.status === 'pending'
          ? 'Account pending approval'
          : 'Account is suspended';

      res.status(403).json({ success: false, message: statusMessage });
      return;
    }

    // 6. Verify password
    const isPinValid = await comparePassword(pin.trim(), account.password);
    if (!isPinValid) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    // 7. Generate JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      res
        .status(500)
        .json({ success: false, message: 'Server configuration error' });
      return;
    }

    const tokenPayload = {
      id: account._id.toString(),
      role: account.userRole,
      status: account.status,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN;
    const token = jwt.sign(tokenPayload, jwtSecret, {
      expiresIn,
    } as jwt.SignOptions);
    // 8. Prepare safe user response (EXPLICIT fields only)
    const userResponse = {
      id: account._id,
      userName: account.userName,
      userEmail: account.userEmail,
      userPhone: account.userPhone,
      userRole: account.userRole,
      status: account.status,
      balance: account.balance,
      photo: account.userPhoto,
    };

    // 9. Set secure cookie + response
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { token, user: userResponse },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && {
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
