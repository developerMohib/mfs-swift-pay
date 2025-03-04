"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.get('/users', userController_1.allUser);
router.get('/transactions/:userId', userController_1.userTransaction);
router.get('/find/:id', userController_1.getLoginUser);
router.put('/status/:id', userController_1.updateStatus);
exports.userRouter = router;
