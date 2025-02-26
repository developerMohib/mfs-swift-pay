"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userNID: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 40 },
    userRole: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    status: {
        type: String,
        enum: ['active', 'block', 'pending'],
        default: 'active',
    },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }],
});
exports.User = (0, mongoose_1.model)('User', userSchema);
