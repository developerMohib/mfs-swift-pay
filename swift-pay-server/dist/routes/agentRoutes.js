"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentRouter = void 0;
const express_1 = require("express");
const agentController_1 = require("../controller/agentController");
const router = (0, express_1.Router)();
// POST route to create a new user
router.get('/agent', agentController_1.allAgent);
exports.agentRouter = router;
