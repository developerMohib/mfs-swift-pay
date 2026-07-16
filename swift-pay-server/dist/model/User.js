"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    userName: { type: String, required: true },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    userNID: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    balance: { type: Number, default: 40 },
    userRole: { type: String, enum: ['user', 'agent', 'admin'], default: 'user' },
    userPhoto: { type: String, default: 'https://avatars.githubusercontent.com/u/92154638?v=4' },
    status: {
        type: String,
        enum: ['active', 'block', 'pending'],
        default: 'active',
    },
    transactions: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Transaction' }],
}, { timestamps: true });
exports.User = (0, mongoose_1.model)('User', userSchema);
