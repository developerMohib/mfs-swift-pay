"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.post('/register', authController_1.registerUser);
router.post('/login', authController_1.login);
router.post('/login', authController_1.login);
exports.authRouter = router;
