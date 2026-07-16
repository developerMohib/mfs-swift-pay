"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRouter = void 0;
const express_1 = require("express");
const agentController_1 = require("../controller/agentController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.get('/agents', agentController_1.allAgent);
router.get('/status/:status', agentController_1.pendingApprovedBlockAgent);
router.put('/status/:id', agentController_1.updateStatusAgent);
router.put('/request/:id', agentController_1.cashInOkayAgent);
router.get('/cash-in/request', agentController_1.getPendingCashInRequests);
exports.agentRouter = router;
