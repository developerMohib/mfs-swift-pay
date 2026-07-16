"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
    const token = req.cookies.auth_token;
    if (!token) {
        res
            .status(401)
            .json({ message: 'Unauthorized: No token provided', path: '/login' });
        return;
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        res.status(500).json({ message: 'Server configuration error' });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error('JWT verification failed:', error);
        res.status(401).json({ message: 'Invalid or expired token' });
        return;
    }
};
exports.authenticate = authenticate;
