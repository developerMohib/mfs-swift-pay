"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.get('/users', userController_1.allUser);
router.put('/status/:id', userController_1.updateStatus);
exports.userRouter = router;
