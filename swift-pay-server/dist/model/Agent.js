"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Agent = void 0;
const mongoose_1 = require("mongoose");
const agentSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userNID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 100000 },
    income: { type: Number, default: 0 },
    userRole: {
        type: String,
        enum: ['user', 'agent', 'admin'],
        default: 'agent',
    },
    status: {
        type: String,
        enum: ['active', 'block', 'pending'],
        default: 'pending',
    },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }],
});
exports.Agent = (0, mongoose_1.model)('Agent', agentSchema);
