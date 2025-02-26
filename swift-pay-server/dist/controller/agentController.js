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
exports.updateStatusAgent = exports.allAgent = void 0;
const Agent_1 = require("../model/Agent");
const allAgent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield Agent_1.Agent.find(); // Fetch all users
        res.send(users); // Send the users back as a JSON response
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
        next(error);
    }
});
exports.allAgent = allAgent;
const updateStatusAgent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate input
        if (!id || !status) {
            res.status(400).json({ message: 'Agent ID and status are required' });
            return;
        }
        // Update user status
        const updatedUser = yield Agent_1.Agent.findByIdAndUpdate(id, { status }, { new: true });
        // Check if user exists
        if (!updatedUser) {
            res.status(404).json({ message: 'Agent not found' });
            return;
        }
        // Send success response
        res.status(200).json({
            message: `Agent status updated to ${status}`,
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
exports.updateStatusAgent = updateStatusAgent;
