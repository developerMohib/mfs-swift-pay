"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Admin = void 0;
const mongoose_1 = require("mongoose");
const AdminSchema = new mongoose_1.Schema({
    userName: { type: String },
    userPhone: { type: String, required: true, unique: true },
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    totalMoneyInSystem: { type: Number, default: 0 },
});
exports.Admin = (0, mongoose_1.model)("Admin", AdminSchema);
