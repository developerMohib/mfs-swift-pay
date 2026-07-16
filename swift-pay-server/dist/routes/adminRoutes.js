"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const authenticate_1 = require("../middleware/authenticate");
const authorize_rba_middleware_1 = require("../middleware/authorize_rba.middleware");
const router = (0, express_1.Router)();
// Public: admin sign-in
router.put('/login', adminController_1.loginAdmin);
// Basic admin display info (name/phone/email) - any signed-in role may
// need this (e.g. an agent viewing who to contact for cash-in requests)
router.get('/find', authenticate_1.authenticate, adminController_1.getAdmin);
// Sensitive: system-wide balance figures - admin only
router.get('/balance', authenticate_1.authenticate, (0, authorize_rba_middleware_1.authorize)('admin'), adminController_1.balanceInSystem);
// An agent asking to top up their float from the admin - agent action
router.put('/cash-in', authenticate_1.authenticate, (0, authorize_rba_middleware_1.authorize)('agent'), adminController_1.agentCashInRequests);
exports.adminRouter = router;
