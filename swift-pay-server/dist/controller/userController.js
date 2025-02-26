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
exports.updateStatus = exports.allUser = void 0;
const User_1 = require("../model/User");
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
