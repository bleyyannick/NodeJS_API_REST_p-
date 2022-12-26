const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel");

const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "faute" });
  }
  // check if user exists
  const userExists = await userModel.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "L'utilisateur existe déjà" });
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
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Paire login/mot de passe incorrecte" });
  }
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res
      .status(401)
      .json({ message: "Paire login/mot de passe incorrecte" });
  }
  res.status(200).json({
    userId: user._id,
    token: jwt.sign({ userId: user._id }, process.env.JWT, {
      expiresIn: "24h",
    }),
  });
};

module.exports = {
  registerUser,
  loginUser,
};
