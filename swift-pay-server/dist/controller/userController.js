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
exports.userTransaction = exports.updateStatus = exports.getLoginUser = exports.allUser = void 0;
const User_1 = require("../model/User");
const Transaction_1 = require("../model/Transaction");
const mongoose_1 = __importDefault(require("mongoose"));
const Agent_1 = require("../model/Agent");
const Admin_1 = require("../model/Admin");
const allUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.User.find(); // Fetch all users
        res.status(200).json(users); // Send the users back as a JSON response
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
        next(error);
    }
});
exports.allUser = allUser;
const getLoginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate if the ID is a valid MongoDB ObjectId
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ error: 'Invalid user ID' });
            return;
        }
        let user = null;
        // Check in User collection
        user = yield User_1.User.findById(id);
        // If not found, check in Admin collection
        if (!user) {
            user = yield Admin_1.Admin.findById(id);
        }
        // If not found, check in Agent collection
        if (!user) {
            user = yield Agent_1.Agent.findById(id);
        }
        // If user is still not found
        if (!user) {
            res
                .status(404)
                .json({ error: 'You are not registered user yet, please register' });
            return;
        }
        // Return the user and the type (User, Admin, or Agent)
        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json({
            error: 'Failed to retrieve user',
            details: err instanceof Error ? err.message : 'An unknown error occurred',
        });
    }
});
exports.getLoginUser = getLoginUser;
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate input
        if (!id || !status) {
            res.status(400).json({ message: 'User ID and status are required' });
            return;
        }
        // Update user status
        const updatedUser = yield User_1.User.findByIdAndUpdate(id, { status }, { new: true });
        // Check if user exists
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Send success response
        res.status(200).json({
            message: `User status updated to ${status}`,
            user: updatedUser,
        });
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
    }
});
exports.updateStatus = updateStatus;
const userTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        console.log('user id', userId);
        // Fetch last 100 transactions for the user (sorted by latest)
        const transactions = yield Transaction_1.Transaction.find({ userId })
            .sort({ createdAt: -1 }) // Sort by most recent
            .limit(100);
        res.status(200).json(transactions);
    }
    catch (error) {
        res
            .status(500)
            .json({ message: 'Server error', error: error.message });
    }
});
exports.userTransaction = userTransaction;
