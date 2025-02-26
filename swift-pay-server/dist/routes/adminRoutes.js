"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adnminRouter = void 0;
const express_1 = require("express");
const adminController_1 = require("../controller/adminController");
const router = (0, express_1.Router)();
router.post('/login', adminController_1.loginAdmin);
// Get admin balance
router.get('/balance');
exports.adnminRouter = router;
