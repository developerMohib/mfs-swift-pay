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
exports.allTransaction = exports.cashOutFromAgent = exports.cashInFromAgent = exports.sendMoney = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../model/User");
const Transaction_1 = require("../model/Transaction");
const Admin_1 = require("../model/Admin");
const authMiddleware_1 = require("../middleware/authMiddleware");
const Agent_1 = require("../model/Agent");
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { senderId, receiverId, amount } = req.body;
        // Validate input minimum 50
        if (!senderId || !receiverId || !amount || amount < 50) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        // Find sender and receiver
        const sender = yield User_1.User.findOne({ _id: new Object(senderId) }).session(session);
        const receiver = yield User_1.User.findOne({ userPhone: receiverId }).session(session);
        if (!sender || !receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender or receiver not found' });
            return;
        }
        // Calculate fee (5 Taka if amount > 100)
        const fee = amount > 100 ? 5 : 0;
        const totalAmount = amount + fee;
        // Check sender balance
        if (sender.balance < totalAmount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Insufficient balance' });
            return;
        }
        // Deduct amount + fee from sender
        sender.balance = sender.balance - totalAmount;
        yield sender.save({ session });
        // Add amount to receiver
        receiver.balance = receiver.balance + amount;
        yield receiver.save({ session });
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            fee,
            type: 'send-money', // Set transaction type
            status: 'success', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        const adminId = process.env.ADMIN_ID; // mongose object id
        // Add fee to admin's balance
        if (adminId) {
            const admin = yield Admin_1.Admin.findOne({ _id: new Object(adminId) }).session(session);
            if (!admin) {
                yield session.abortTransaction();
                res.status(404).json({ error: 'Admin not found' });
                return;
            }
            admin.balance += fee;
            yield admin.save({ session });
        }
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Money sent successfully',
            transaction,
            remainingBalance: sender.balance,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        res.status(500).json({
            error: 'Registration failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
    finally {
        session.endSession();
    }
});
exports.sendMoney = sendMoney;
const cashInFromAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { senderId, receiverId, amount } = req.body;
        // Validate input
        if (!senderId || !receiverId || !amount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        // Find sender and receiver
        const sender = yield User_1.User.findOne({ _id: new Object(senderId) }).session(session);
        const receiver = yield User_1.User.findOne({ userPhone: receiverId }).session(session);
        if (!sender || !receiver) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender or receiver not found' });
            return;
        }
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: 'cash-in', // Set transaction type
            status: 'success', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history
        sender.transactions.push(transaction._id);
        receiver.transactions.push(transaction._id);
        yield sender.save({ session });
        yield receiver.save({ session });
        yield session.commitTransaction();
        res.status(200).json({
            message: 'Cash In successfully',
            transaction,
            remainingBalance: sender.balance,
        });
    }
    catch (err) {
        yield session.abortTransaction();
        res.status(500).json({
            error: 'Registration failed',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
    finally {
        session.endSession();
    }
});
exports.cashInFromAgent = cashInFromAgent;
const cashOutFromAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { senderId, receiverId, amount, password } = req.body;
        console.log(180, req.body);
        // Validate input
        if (!senderId || !receiverId || !amount) {
            yield session.abortTransaction();
            res.status(400).json({ error: 'Invalid input' });
            return;
        }
        // Find sender and receiver
        const sender = yield User_1.User.findOne({ _id: new Object(senderId) }).session(session);
        if (!sender) {
            yield session.abortTransaction();
            res.status(404).json({ error: 'Sender not found' });
            return;
        }
        const isMatch = (yield (0, authMiddleware_1.comparePassword)(password, sender.password));
        if (!isMatch) {
            res
                .status(400)
                .json({ success: false, message: 'Invalid PIN not found' });
            return;
        }
        // find agent
        const receiver = yield Agent_1.Agent.findOne({ userPhone: receiverId }).session(session);
        console.log('receiver', receiver);
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
        console.log('final amount', finalAmount);
        // find Admin
        const adminId = process.env.ADMIN_ID; // mongose object id
        // Add fee to admin's balance
        if (adminId) {
            const admin = yield Admin_1.Admin.findOne({ _id: new Object(adminId) }).session(session);
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
        receiver.balance += agentFee; // Add final amount to agent
        receiver.income += agentFee; // Update agent's income
        // Save changes
        yield sender.save();
        yield receiver.save();
        // Record transaction
        const transaction = new Transaction_1.Transaction({
            sender: sender._id,
            receiver: receiver._id,
            amount,
            type: 'cash-out', // Set transaction type
            status: 'success', // Set transaction status
        });
        yield transaction.save({ session });
        // Update sender and receiver transaction history
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
            error: 'Registration failed',
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
        const result = yield Transaction_1.Transaction.find();
        console.log(result);
        res.status(200).json({
            message: 'All transaction retrive successfully',
            data: result,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.allTransaction = allTransaction;
