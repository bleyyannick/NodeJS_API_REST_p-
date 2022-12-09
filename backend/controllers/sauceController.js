const asyncHandler = require("express-async-handler");
const sauceModel = require("../model/sauceModel");

const getSauce = asyncHandler(async (req, res) => {
  const sauces = await sauceModel.find();
  res.status(200).json({ message: "Get sauce" });
});

const setSauce = asyncHandler(async (req, res) => {
  if (!req.body.text) {
    res.status(400);
    throw new Error("Please add a sauce");
  }
  const sauce = await sauceModel.create({
    text: req.body.text,
  });
  res.status(200).json(sauceModel);
});

const updateSauce = asyncHandler(async (req, res) => {
  const sauce = await sauceModel.findById(req.params.id);
});

module.exports = {
  setSauce,
  getSauce,
  updateSauce,
};
