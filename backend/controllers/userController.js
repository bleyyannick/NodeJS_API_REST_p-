const asyncHandler = require("express-async-handler");
const userModel = require("../model/userModel");

const registerNewUser = (req, res) => {
  res.json({ message: "C'est nouveau" });
};

const loginUser = (req, res) => {
  res.json({ message: "C'est nouveau" });
};

module.exports = {
  registerNewUser,
  loginUser,
};
