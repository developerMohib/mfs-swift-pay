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
exports.sendMoney = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../model/User");
const Transaction_1 = require("../model/Transaction");
const Admin_1 = require("../model/Admin");
const sendMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { senderId, receiverId, amount } = req.body;
        // Validate input
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
