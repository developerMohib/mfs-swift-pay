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
exports.balanceInSystem = exports.loginAdmin = void 0;
const Admin_1 = require("../model/Admin");
const authMiddleware_1 = require("../middleware/authMiddleware");
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(' 8', req.body);
        const admin = yield Admin_1.Admin.findOne({ email });
        console.log(' 10', admin);
        if (!admin) {
            res.status(400).json({ message: 'Admin not found' });
            return;
        }
        // Verify pin
        const isMatch = yield (0, authMiddleware_1.comparePassword)(password, admin.password);
        console.log(18, isMatch);
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials' });
            return;
        }
        // Generate JWT token
        // const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
        res.status(200).json({ message: 'Login successful', admin });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.loginAdmin = loginAdmin;
const balanceInSystem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const admin = yield Admin_1.Admin.findOne();
        if (!admin)
            return res.status(404).json({ message: 'Admin not found' });
        res.status(200).json({
            balance: admin.balance,
            totalMoneyInSystem: admin.totalMoneyInSystem,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.balanceInSystem = balanceInSystem;
