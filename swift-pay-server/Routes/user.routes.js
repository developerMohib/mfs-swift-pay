const express = require("express");
const { allUser, createUser, loginUser } = require("../controllers/user.controller");
const router = express.Router();

// POST route to create a new user
router.post("/user", createUser);

router.post("/user", loginUser);
router.get("/users", allUser);

module.exports = router;
