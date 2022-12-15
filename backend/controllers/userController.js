const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error });
  }
  // check if user exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("L'utilisateur existe déjà");
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    email,
    password: hashedPassword,
  });
  if (user) {
    res.status(201).json({
      message: "Utilisateur créé!",
    });
  } else {
    return res
      .status(401)
      .json({ message: "l'email ou le mot de passe est incorrect" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Paire login/mot de passe incorrecte" });
    }
    const valid = bcrypt.compare(password, { password });
    if (!valid) {
      return res
        .status(401)
        .json({ message: "Paire login/mot de passe incorrecte" });
    }
    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, "TOKEN", { expiresIn: "24h" }),
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
