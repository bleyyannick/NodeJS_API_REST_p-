const express = require("express");
const { registerNewUser } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", registerNewUser);

module.exports = router;
