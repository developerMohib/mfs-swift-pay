"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transectionRouter = void 0;
const express_1 = require("express");
const transactionController_1 = require("../controller/transactionController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.put('/send-money', transactionController_1.sendMoney);
router.put('/cash-out', transactionController_1.cashOutFromAgent);
router.put('/cash-in', transactionController_1.cashInFromAgent);
exports.transectionRouter = router;
