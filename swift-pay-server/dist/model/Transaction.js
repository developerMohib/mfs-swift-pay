"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    sender: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    fee: { type: Number, default: 0 },
    type: { type: String, enum: ["send-money", "cash-in", "cash-out"], required: true },
    status: { type: String, enum: ["success", "failed", "pending"], default: "pending" },
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
