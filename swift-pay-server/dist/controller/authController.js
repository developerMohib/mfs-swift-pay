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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.registerUser = void 0;
const User_1 = require("../model/User");
const Agent_1 = require("../model/Agent");
const authMiddleware_1 = require("../middleware/authMiddleware");
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, userEmail, password, userPhone, userNID, userRole } = req.body;
    // Validate required fields
    if (!userName ||
        !userEmail ||
        !password ||
        !userPhone ||
        !userNID ||
        !userRole) {
        res.status(400).json({ error: 'All fields are required' });
        return;
    }
    try {
        // Hash the password
        const hashedPin = yield (0, authMiddleware_1.hashPassword)(password);
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
        const existingUser = yield User_1.User.findOne(query);
        const existingAgent = yield Agent_1.Agent.findOne(query);
        if (existingUser || existingAgent) {
            const usedEmail = (existingUser === null || existingUser === void 0 ? void 0 : existingUser.userEmail) === userEmail ||
                (existingAgent === null || existingAgent === void 0 ? void 0 : existingAgent.userEmail) === userEmail
                ? userEmail
                : null;
            const usedPhone = (existingUser === null || existingUser === void 0 ? void 0 : existingUser.userPhone) === userPhone ||
                (existingAgent === null || existingAgent === void 0 ? void 0 : existingAgent.userPhone) === userPhone
                ? userPhone
                : null;
            const usedNID = (existingUser === null || existingUser === void 0 ? void 0 : existingUser.userNID) === userNID || (existingAgent === null || existingAgent === void 0 ? void 0 : existingAgent.userNID) === userNID
                ? userNID
                : null;
            const usedValue = usedEmail || usedPhone || usedNID;
            res.status(400).json({
                error: `${usedValue} is already in use. Please use a different ${usedValue}.`,
            });
            return;
        }
        // Create a new user or agent based on the role
        const newUser = userRole === 'user' ? new User_1.User(userData) : new Agent_1.Agent(userData);
        yield newUser.save();
        res.status(201).json({ message: 'Registration successful', user: newUser });
    }
    catch (err) {
        res.status(500).json({
            error: 'Registration failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
});
exports.registerUser = registerUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneOrEmail, pin } = req.body;
    if (!phoneOrEmail || !pin) {
        res.status(400).json({ error: 'Missing phone Email or pin' });
        return;
    }
    try {
        const [user, agent] = yield Promise.all([
            User_1.User.findOne({
                $or: [{ userEmail: phoneOrEmail }, { userPhone: phoneOrEmail }],
            }),
            Agent_1.Agent.findOne({
                $or: [{ userEmail: phoneOrEmail }, { userPhone: phoneOrEmail }],
            }),
        ]);
        const account = user !== null && user !== void 0 ? user : agent;
        if (!account || !(yield (0, authMiddleware_1.comparePassword)(pin, account.password))) {
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
    }
    catch (err) {
        if (err instanceof Error) {
            res.status(400).json({ error: 'Login failed', details: err.message });
        }
        else {
            res
                .status(400)
                .json({ error: 'Login failed', details: 'something wrong' });
        }
    }
});
exports.login = login;
