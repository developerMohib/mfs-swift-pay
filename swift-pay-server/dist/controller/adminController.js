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
exports.agentCashInRequests = exports.balanceInSystem = exports.getAdmin = exports.loginAdmin = void 0;
const Admin_1 = require("../model/Admin");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Agent_1 = require("../model/Agent");
const Transaction_1 = require("../model/Transaction");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const admin = yield Admin_1.Admin.findOne({ userEmail: email });
        if (!admin) {
            res.status(400).json({ message: 'Admin not found' });
            return;
        }
        // Verify pin
        const isMatch = yield (0, authMiddleware_1.comparePassword)(password, admin.password);
        console.log(19, isMatch);
        // if (!isMatch) {
        //   res.status(400).json({ message: 'Invalid credentials' });
        //   return;
        // }
        // Generate JWT token
        // const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        res.status(200).json({ message: 'Login successful', admin });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.loginAdmin = loginAdmin;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Admin_1.Admin.find().select('userName userPhone userRole userEmail');
        res.send(result);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.getAdmin = getAdmin;
const balanceInSystem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.Admin.findOne();
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({
            balance: admin.balance,
            totalMoneyInSystem: admin.totalMoneyInSystem,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.balanceInSystem = balanceInSystem;
const agentCashInRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId, amount, password } = req.body;
        const agent = yield Agent_1.Agent.findById(senderId);
        if (!senderId || !receiverId || !amount || amount < 50) {
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        if (!agent) {
            res.status(404).json({ error: 'Agent not found' });
            return;
        }
        const isMatch = yield (0, authMiddleware_1.comparePassword)(password, agent.password);
        console.log('is match', isMatch);
        const adminId = process.env.ADMIN_ID; // mongose object id
        // Add fee to admin's balance
        if (adminId) {
            const admin = yield Admin_1.Admin.findOne({ _id: new Object(adminId) });
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
