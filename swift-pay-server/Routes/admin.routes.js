const express = require("express");
const router = express.Router();
const { loginAdmin, getAdmin } = require("../controllers/admin.controller");

router.get("/login", loginAdmin);
router.get("/find", getAdmin);
module.exports = router;
