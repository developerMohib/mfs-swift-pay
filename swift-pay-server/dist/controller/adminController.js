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
exports.agentCashInRequests = exports.balanceInSystem = exports.getAdmin = exports.loginAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = require("../model/Admin");
const password_utils_1 = require("../utils/password.utils");
const Agent_1 = require("../model/Agent");
const Transaction_1 = require("../model/Transaction");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }
        const admin = yield Admin_1.Admin.findOne({ userEmail: email }).select('+password');
        if (!admin) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = yield (0, password_utils_1.comparePassword)(password, admin.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not configured');
            res.status(500).json({ message: 'Server configuration error' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: admin._id.toString(), role: 'admin' }, jwtSecret, { expiresIn: (process.env.JWT_EXPIRES_IN || '7d') });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
        });
        const adminResponse = {
            id: admin._id,
            userName: admin.userName,
            userEmail: admin.userEmail,
            userPhone: admin.userPhone,
            userRole: 'admin',
            balance: admin.balance,
        };
        res.status(200).json({
            message: 'Login successful',
            admin: adminResponse,
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.loginAdmin = loginAdmin;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Admin_1.Admin.find().select('userName userPhone userRole userEmail');
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.getAdmin = getAdmin;
const balanceInSystem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.Admin.findOne();
        if (!admin) {
            res.status(404).json({ message: 'Admin not found' });
            return;
        }
        res.status(200).json({
            balance: admin.balance,
            totalMoneyInSystem: admin.totalMoneyInSystem,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});
exports.balanceInSystem = balanceInSystem;
const agentCashInRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { receiverId, amount, password } = req.body;
        // Trust the authenticated agent's own id, not a client-supplied senderId.
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!senderId || !receiverId || !amount || amount < 50) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        const agent = yield Agent_1.Agent.findById(senderId).select('+password');
        if (!agent) {
            res.status(404).json({ error: 'Agent not found' });
            return;
        }
        const isMatch = yield (0, password_utils_1.comparePassword)(password, agent.password);
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid password' });
            return;
        }
        const adminId = process.env.ADMIN_ID;
        if (adminId) {
            const admin = yield Admin_1.Admin.findById(adminId);
            if (!admin) {
                res.status(404).json({ error: 'Admin not found' });
                return;
            }
        }
        const transaction = new Transaction_1.Transaction({
            sender: agent._id,
            receiver: adminId,
            amount,
            type: 'cash-in', // Set transaction type
            status: 'pending', // Set transaction status
        });
        yield transaction.save();
        res.status(200).json({
            message: 'Cash In Request successfully',
            transaction,
        });
    }
    catch (error) {
        console.error('Error fetching pending requests:', error);
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
    }
});
exports.agentCashInRequests = agentCashInRequests;
