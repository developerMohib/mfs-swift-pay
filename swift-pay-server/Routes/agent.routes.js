const express = require("express");
const { createAgent } = require("../controllers/agent.controller");
const router = express.Router();

// POST route to create a new user
router.post("/create", createAgent);
router.get("/agent", createAgent);
module.exports = router;