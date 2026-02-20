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
exports.findExistingRecords = exports.validateRegistrationFields = void 0;
const Agent_1 = require("../model/Agent");
const User_1 = require("../model/User");
const validateRegistrationFields = (fields) => {
    const { userName, userEmail, password, userPhone, userNID, userRole } = fields;
    if (!userName ||
        !userEmail ||
        !password ||
        !userPhone ||
        !userNID ||
        !userRole) {
        return 'All fields are required';
    }
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userEmail)) {
        return 'Invalid email format';
    }
    // Password strength validation
    if (password.length < 5 || password.length > 20) {
        return 'Password must be between 5 and 20 characters long';
    }
    // Phone number validation (basic)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(userPhone)) {
        return 'Invalid phone number format';
    }
    // Role validation
    if (!['user', 'agent', 'admin', 'superadmin'].includes(userRole)) {
        return 'Invalid user role';
    }
    // NID validation (adjust based on your country)
    if ((userNID.length < 10) || (userNID.length > 17)) {
        return 'Invalid NID number';
    }
    return null;
};
exports.validateRegistrationFields = validateRegistrationFields;
// Check for existing fields in both User and Agent collections
const findExistingRecords = (email, phone, nid) => __awaiter(void 0, void 0, void 0, function* () {
    const normalizedEmail = email.toLocaleLowerCase().trim();
    const [existingUser, existingAgent] = yield Promise.all([
        User_1.User.findOne({
            $or: [
                { userEmail: normalizedEmail },
                { userPhone: phone },
                { userNID: nid },
            ],
        }),
        Agent_1.Agent.findOne({
            $or: [
                { userEmail: normalizedEmail },
                { userPhone: phone },
                { userNID: nid },
            ],
        }),
    ]);
    const existingRecord = existingUser || existingAgent;
    if (!existingRecord) {
        return { exists: false };
    }
    // Determine which field is duplicate
    if (existingRecord.userEmail === normalizedEmail) {
        return {
            exists: true,
            message: 'Email already registered',
            field: 'userEmail',
        };
    }
    if (existingRecord.userPhone === phone) {
        return {
            exists: true,
            message: 'Phone number already registered',
            field: 'userPhone',
        };
    }
    if (existingRecord.userNID === nid) {
        return {
            exists: true,
            message: 'NID already registered',
            field: 'userNID',
        };
    }
    return { exists: false };
});
exports.findExistingRecords = findExistingRecords;
