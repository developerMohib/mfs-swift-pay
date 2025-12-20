import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../model/User';
import { Agent } from '../model/Agent';
import { comparePassword, hashPassword } from '../middleware/authMiddleware';
import {
  validateRegistrationFields,
  findExistingRecords,
} from '../validators/register.validator';
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

    if (error.code === 11000) {
      // MongoDB duplicate key error
      res.status(409).json({
        success: false,
        message: 'Duplicate entry found. Please check your details.',
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
    const trimmedInput = phoneOrEmail?.trim();
    const trimmedPin = pin?.trim();

    if (!trimmedInput || !trimmedPin) {
      res.status(400).json({
        success: false,
        message: 'Phone/Email and PIN are required',
      });
      return;
    }

    // Validate PIN length
    if (trimmedPin.length <= 5 || trimmedPin.length >= 17) {
      res.status(400).json({
        success: false,
        message: 'PIN must be 4-6 digits',
      });
      return;
    }

    const normalizedInput = trimmedInput.toLowerCase();
    const isEmail = normalizedInput.includes('@');

    // Optimize query based on input type
    const query = isEmail
      ? { userEmail: normalizedInput }
      : {
          $or: [
            { userEmail: normalizedInput },
            { userPhone: trimmedInput.replace(/\D/g, '') }, // Remove non-digits for phone
          ],
        };
    const [user, agent] = await Promise.all([
      User.findOne(query).select('+password'), // Explicitly include password field
      Agent.findOne(query).select('+password'),
    ]);

    const account = user || agent;

    if (!account) {
      // For security, don't specify whether it was phone or email that wasn't found
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    /* -------------------- 3. Check Account Status -------------------- */
    if (account.status !== 'active') {
      const statusMessage =
        account.status === 'pending'
          ? 'Account pending approval'
          : 'Account is suspended';

      res.status(403).json({
        success: false,
        message: statusMessage,
      });
      return;
    }

    const isPinValid = await comparePassword(trimmedPin, account.password);

    if (!isPinValid) {
      // Log failed attempt (you could implement rate limiting here)
      console.warn(`Failed login attempt for: ${normalizedInput}`);

      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    const tokenPayload = {
      id: account._id.toString(),
      role: account.userRole,
      ...(account.status && { status: account.status }),
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('JWT_SECRET is not configured');
      res.status(500).json({
        success: false,
        message: 'Authentication service error',
      });
      return;
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    const token = jwt.sign(
      tokenPayload,
      jwtSecret,
      { expiresIn } as jwt.SignOptions, // Type assertion if needed
    );

    const { ...safeUserData } = account.toObject();

    const userResponse = {
      id: safeUserData._id,
      userName: safeUserData.userName,
      userEmail: safeUserData.userEmail,
      userPhone: safeUserData.userPhone,
      userRole: safeUserData.userRole,
      status: safeUserData.status,
      balance: safeUserData.balance,
    };

    // For enhanced security, consider setting token in HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token, // Still include in response for mobile clients if needed
        user: userResponse,
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'JsonWebTokenError') {
        res.status(500).json({
          success: false,
          message: 'Authentication configuration error',
        });
        return;
      }
    } else {
      res
        .status(400)
        .json({ error: 'Login failed', details: 'Network something wrong' });
    }
  }
};
