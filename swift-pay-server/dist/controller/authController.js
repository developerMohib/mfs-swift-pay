"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.registerUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../model/User");
const Agent_1 = require("../model/Agent");
const authMiddleware_1 = require("../middleware/authMiddleware");
const register_validator_1 = require("../validators/register.validator");
const login_validator_1 = require("../validators/login.validator");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, userEmail, password, userPhone, userNID, userRole } = req.body;
        // Validation
        const validationError = (0, register_validator_1.validateRegistrationFields)({
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
        const existingRecords = yield (0, register_validator_1.findExistingRecords)(userEmail, userPhone, userNID);
        if (existingRecords.exists) {
            res.status(409).json({
                success: false,
                message: existingRecords.message,
                field: existingRecords.field,
            });
            return;
        }
        // Hash password
        const hashedPassword = yield (0, authMiddleware_1.hashPassword)(password);
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
        };
        // Create and save user
        const Model = userRole === 'user' ? User_1.User : Agent_1.Agent;
        const newUser = new Model(userData);
        yield newUser.save();
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
    }
    catch (error) {
        // Handle specific error types
        if (error.name === 'ValidationError') {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors,
            });
            return;
        }
        res.status(500).json(Object.assign({ success: false, message: 'Registration failed due to network' }, (process.env.NODE_ENV === 'development' && {
            error: error.message,
        })));
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneOrEmail, pin } = req.body;
    try {
        // 1. Validate input
        const validationError = (0, login_validator_1.validateLogin)({
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
        const [user, agent] = yield Promise.all([
            User_1.User.findOne(query).select('+password'),
            Agent_1.Agent.findOne(query).select('+password'),
        ]);
        const account = user || agent;
        if (!account) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // 5. Check account status for agents only
        if (account.status !== 'active') {
            const statusMessage = account.status === 'pending'
                ? 'Account pending approval'
                : 'Account is suspended';
            res.status(403).json({ success: false, message: statusMessage });
            return;
        }
        // 6. Verify password
        const isPinValid = yield (0, authMiddleware_1.comparePassword)(pin.trim(), account.password);
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
        const token = jsonwebtoken_1.default.sign(tokenPayload, jwtSecret, {
            expiresIn,
        });
        console.log('Generated JWT token:', token);
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
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        });
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: { token, user: userResponse },
        });
    }
    catch (error) {
        res.status(500).json(Object.assign({ success: false, message: 'Internal server error' }, (process.env.NODE_ENV === 'development' && {
            error: error instanceof Error ? error.message : 'Unknown error',
        })));
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('auth_token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            path: '/sign-in',
        });
        res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
exports.logout = logout;
