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
exports.cashInOkayAgent = exports.getPendingCashInRequests = exports.updateStatusAgent = exports.pendingApprovedBlockAgent = exports.allAgent = void 0;
const Agent_1 = require("../model/Agent");
const Transaction_1 = require("../model/Transaction");
const User_1 = require("../model/User");
const allAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const agents = yield Agent_1.Agent.find().select('-password'); // Fetch all agents
        res.status(200).json({
            success: true,
            message: 'Agents fetched successfully',
            data: agents,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching agents', error });
        next(error);
    }
});
exports.allAgent = allAgent;
const pendingApprovedBlockAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const status = req === null || req === void 0 ? void 0 : req.params.status;
        const agents = yield Agent_1.Agent.find({ status })
            .select('-password')
            .sort({ createdAt: -1 }); // Optional: newest first
        res.status(200).json({
            success: true,
            message: `${status} agents fetched successfully`,
            data: agents,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ success: false, message: 'Error fetching agents', error });
        next(error);
    }
});
exports.pendingApprovedBlockAgent = pendingApprovedBlockAgent;
const updateStatusAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate input
        if (!id || !status) {
            res.status(400).json({ message: 'Agent ID and status are required' });
            return;
        }
        // Find the agent by ID
        const agent = yield Agent_1.Agent.findById(id);
        if (!agent) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }
        if (agent.status === status) {
            res.status(400).json({ message: `Agent is already ${status}` });
            return;
        }
        const shouldAddBonus = agent.status === 'pending' && status === 'active';
        if (shouldAddBonus) {
            agent.balance = (agent.balance || 0) + 100000;
        }
        agent.status = status;
        yield agent.save();
        // Send success response
        res.status(200).json({
            success: true,
            message: `Agent status updated to ${status}`,
            data: {
                id: agent._id,
                userName: agent.userName,
                userPhone: agent.userPhone,
                status: agent.status,
                balance: agent.balance,
            },
        });
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({
            message: 'Error updating user status',
            error: error.message,
        });
    }
});
exports.updateStatusAgent = updateStatusAgent;
const getPendingCashInRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const agentId = req;user?.id;
        const pendingRequests = yield Transaction_1.Transaction.find({
            status: 'pending',
            type: 'cash-in',
        });
        if (!pendingRequests.length) {
            res.status(404).json({ message: 'No pending cash-in requests found' });
            return;
        }
        res.status(200).json({
            message: 'Pending cash-in requests retrieved successfully',
            data: pendingRequests,
        });
    }
    catch (error) {
        console.error('Error fetching pending requests:', error);
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
    }
});
exports.getPendingCashInRequests = getPendingCashInRequests;
const cashInOkayAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!id || !status) {
            res
                .status(400)
                .json({ message: 'Transaction ID and status are required' });
            return;
        }
        const transaction = yield Transaction_1.Transaction.findById(id);
        if (!transaction) {
            res.status(404).json({ message: 'Transaction not found' });
            return;
        }
        if (transaction.status !== 'pending') {
            res
                .status(400)
                .json({ message: 'This transaction has already been processed' });
            return;
        }
        const agent = yield Agent_1.Agent.findById(transaction.receiver);
        const user = yield User_1.User.findById(transaction.sender);
        if (!agent || !user) {
            res.status(404).json({ message: `${agent} ${user} not found` });
            return;
        }
        if (status === 'approved') {
            if (agent.balance < transaction.amount) {
                res
                    .status(400)
                    .json({ message: "Insufficient balance in agent's account" });
                return;
            }
            // Deduct from agent balance
            agent.balance -= transaction.amount;
            // Add to user's balance
            user.balance = (user.balance || 0) + transaction.amount;
            // Update transaction status
            transaction.status = 'success';
            // Save updates
            yield agent.save();
            yield user.save();
            yield transaction.save();
            res.status(200).json({ message: 'Transaction approved successfully' });
        }
        else if (status === 'rejected') {
            // If rejected, no changes, just update the transaction status
            transaction.status = 'failed';
            yield transaction.save();
            res.status(200).json({ message: 'Transaction rejected' });
        }
        else {
            res.status(200).json({ message: 'Transaction something wrong' });
        }
    }
    catch (error) {
        console.error('Error updating transaction status:', error);
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
    }
});
exports.cashInOkayAgent = cashInOkayAgent;
