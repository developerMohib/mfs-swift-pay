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
        console.log(24, status);
        // Validate input
        if (!id || !status) {
            res.status(400).json({ message: "Agent ID and status are required" });
            return;
        }
        // Find the agent by ID
        const agent = yield Agent_1.Agent.findById(id);
        if (!agent) {
            res.status(404).json({ message: "Agent not found" });
            return;
        }
        // Check if the agent is new and status is being updated to "approved"
        let bonusAdded = false;
        if (agent.status === "pending" && status === "active") {
            agent.balance = (agent.balance || 0) + 100000; // Add first-time bonus
            bonusAdded = true;
        }
        // Update agent status
        agent.status = status;
        yield agent.save();
        // Send success response
        res.status(200).json({
            message: `Agent status updated to ${status}`,
            bonusAdded: bonusAdded ? 100000 : 0, // Indicate if bonus was added
            user: agent,
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
