const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const { passwordValidation } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", passwordValidation, registerUser);
router.post("/login", loginUser);

module.exports = router;
