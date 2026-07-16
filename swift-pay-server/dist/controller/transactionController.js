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
exports.allTransaction = exports.cashOutFromAgent = exports.cashInFromAgent = exports.cashDeposit = exports.sendMoney = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../model/User");
const Transaction_1 = require("../model/Transaction");
const Admin_1 = require("../model/Admin");
const Agent_1 = require("../model/Agent");
const password_utils_1 = require("../utils/password.utils");
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const { recipientPhone, amount, pin } = req.body;
    // Trust the authenticated session, not a client-supplied senderId -
    // otherwise any logged-in user could pass someone else's id and
    // drain their account.
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        // Validate required fields and amount
        if (!senderId ||
            !recipientPhone ||
            !pin ||
            !amount ||
            isNaN(amount) ||
            amount < 50) {
            yield session.abortTransaction();
            res.status(400).json({
                success: false,
                error: 'Invalid input: amount must be ≥ 50 and all fields required',
            });
            return;
        }
        // Find sender and receiver in parallel
        const [sender, receiver] = yield Promise.all([
            User_1.User.findById(senderId).select('+password').session(session),
            User_1.User.findOne({ userPhone: recipientPhone }).session(session),
        ]);
        if (!sender) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender not found' });
            return;
        }
        if (!receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Receiver not found' });
            return;
        }
        if (sender._id.toString() === receiver._id.toString()) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Cannot send money to yourself' });
            return;
        }
        // Verify PIN before moving any money - this check was previously
        // missing, meaning any non-empty "pin" value was accepted.
        const isPinValid = yield (0, password_utils_1.comparePassword)(pin, sender.password);
        if (!isPinValid) {
            yield session.abortTransaction();
            res.status(401).json({ success: false, error: 'Invalid PIN' });
            return;
        }
        // Calculate fee and total deduction
        const fee = amount >= 100 ? 5 : 0;
        const totalDeduction = amount + fee;
        // Check sender balance
        if (sender.balance < totalDeduction) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        // Update balances
        sender.balance -= totalDeduction;
        receiver.balance += amount;
        // Create transaction record
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            fee,
            type: 'send-money',
            status: 'success',
        });
        // Save transaction and update user transaction histories
        yield transaction.save({ session });
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        // Save sender and receiver (balances + transaction history)
        yield Promise.all([sender.save({ session }), receiver.save({ session })]);
        // Add fee to admin balance if configured
        const adminId = process.env.ADMIN_ID;
        if (fee >= 0 && adminId) {
            const admin = yield Admin_1.Admin.findById(adminId).session(session);
            if (admin) {
                admin.balance += fee;
                yield admin.save({ session });
            }
            else {
                res
                    .status(404)
                    .json({
                    success: false,
                    error: 'Admin not found for fee allocation',
                });
                return;
            }
        }
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Send Money successfully',
            transaction,
            remainingBalance: sender.balance,
        });
        return;
    }
    catch (err) {
        yield session.abortTransaction();
        console.error('Send money failed:', err); // Optional logging
        res.status(500).json({
            error: 'Send money failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
        return;
    }
    finally {
        session.endSession();
    }
});
exports.sendMoney = sendMoney;
const cashDeposit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { receiverId, amount } = req.body;
        // Trust the authenticated agent's own id rather than a client-supplied
        // senderId, which previously let any agent drain another agent's balance.
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validate input minimum 50
        if (!senderId || !receiverId || !amount || amount < 50) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        // Find sender and receiver
        const sender = yield Agent_1.Agent.findById(senderId).session(session);
        const receiver = yield User_1.User.findOne({ userPhone: receiverId }).session(session);
        if (!sender || !receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender or receiver not found' });
            return;
        }
        // Check sender balance
        if (sender.balance < amount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        // Deduct amount from sender, credit receiver
        sender.balance -= amount;
        receiver.balance += amount;
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: 'cash-in', // Set transaction type
            status: 'success', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history, then save both
        // balance + history changes exactly once, inside the transaction.
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Money deposit successfully',
            transaction,
            remainingBalance: sender.balance,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        res.status(500).json({
            error: 'Cash deposit failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
    finally {
        session.endSession();
    }
});
exports.cashDeposit = cashDeposit;
const cashInFromAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    const { receiverId, amount, password } = req.body;
    // Trust the authenticated user's own id rather than a client-supplied senderId.
    const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Validate input
    if (!senderId || !receiverId || !amount) {
        yield session.abortTransaction();
        res.status(400).json({ error: 'Invalid input' });
        return;
    }
    try {
        // Find sender and receiver
        const sender = yield User_1.User.findById(senderId).select('+password').session(session);
        const receiver = yield Agent_1.Agent.findOne({ userPhone: receiverId }).session(session);
        if (!sender || !receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender or receiver not found' });
            return;
        }
        const isMatch = yield (0, password_utils_1.comparePassword)(password, sender.password);
        if (!isMatch) {
            yield session.abortTransaction();
            res.status(401).json({ success: false, message: 'Invalid PIN' });
            return;
        }
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: 'cash-in', // Set transaction type
            status: 'pending', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Cash In Request successfully',
            transaction,
            remainingBalance: sender.balance,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        res.status(500).json({
            error: 'Cash-in request failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
    finally {
        session.endSession();
    }
});
exports.cashInFromAgent = cashInFromAgent;
const cashOutFromAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { receiverId, amount, password } = req.body;
        // Trust the authenticated user's own id rather than a client-supplied senderId.
        const senderId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Validate input
        if (!senderId || !receiverId || !amount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        // Find sender
        const sender = yield User_1.User.findById(senderId).select('+password').session(session);
        if (!sender) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender not found' });
            return;
        }
        const isMatch = yield (0, password_utils_1.comparePassword)(password, sender.password);
        if (!isMatch) {
            yield session.abortTransaction();
            res
                .status(401)
                .json({ success: false, message: 'Invalid PIN' });
            return;
        }
        if (sender.balance < amount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        // find agent
        const receiver = yield Agent_1.Agent.findOne({ userPhone: receiverId }).session(session);
        if (!receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Receiver not found' });
            return;
        }
        // Fee Calculation
        const totalFee = amount * (1.5 / 100); // 1.5% of amount
        const agentFee = amount * (1 / 100); // 1% to agent
        const adminFee = amount * (0.5 / 100); // 0.5% to admin
        const finalAmount = amount - totalFee; // Amount user receives from agent
        const adminId = process.env.ADMIN_ID;
        if (adminId) {
            const admin = yield Admin_1.Admin.findById(adminId).session(session);
            if (!admin) {
                yield session.abortTransaction();
                res.status(404).json({ error: 'Admin not found' });
                return;
            }
            admin.balance += adminFee;
            yield admin.save({ session });
        }
        // Update balances
        sender.balance -= amount; // Deduct full amount from user
        receiver.balance += finalAmount; // Add final amount to agent
        receiver.income += agentFee; // Update agent's income
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: 'cash-out', // Set transaction type
            status: 'success', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history, then persist
        // balance + history changes exactly once, inside the transaction.
        // (Previously sender/receiver were saved twice - once outside the
        // session, breaking atomicity, then again inside it.)
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Cash out successfully',
            transaction,
            remainingBalance: sender.balance,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        res.status(500).json({
            error: 'Cash out transaction failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
    finally {
        session.endSession();
    }
});
exports.cashOutFromAgent = cashOutFromAgent;
const allTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield Transaction_1.Transaction.find()
            .populate('sender', 'userName userPhone userEmail userRole') // Fetch sender details
            .populate('receiver', 'userName userPhone userEmail userRole');
        res.status(200).json({
            message: 'All transaction retrive successfully',
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            error: 'All transaction failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
});
exports.allTransaction = allTransaction;
