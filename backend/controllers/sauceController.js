const asyncHandler = require("express-async-handler");
const sauceModel = require("../model/sauceModel");
// GET /api/sauces
const getSauces = asyncHandler(async (req, res) => {
  const sauces = await sauceModel.find();
  res.status(200).json(sauces);
});

//GET /api/sauces/:id
const getSauce = asyncHandler(async (req, res) => {
  const sauce = await sauceModel.findById({ _id: req.params.id });
  if (!sauce) {
    return res.status(400).json({ message: "la sauce n'a pas été trouvée" });
  }
  res.status(200).json(sauce);
});

//POST /api/sauces
const postSauce = asyncHandler(async (req, res) => {
  if (!req.body.sauce || req.body.image) {
    res
      .status(400)
      .json({ message: "Veuillez ajouter une sauce avec une image" });
  }
  delete req.body._id;
  await sauceModel.create({
    ...req.body,
  });
  res.status(200).json({ message: "Votre sauce a bien été ajouté" });
});

//POST /api/sauces/:id/like
const postSauceLike = asyncHandler(async (req, res) => {});

//PUT /api/sauces/:id
const updateSauce = asyncHandler(async (req, res) => {
  const sauce = await sauceModel.findById(req.params.id);
  if (!sauce) {
    return res.status(400).json({ message: "La sauce n'a pas été trouvée " });
  }
  const editedSauce = await sauceModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(editedSauce);
});

//DELETE /api/sauces/:id
const deleteSauce = asyncHandler(async (req, res) => {
  const deletedSauce = await sauceModel.findById(req.params.id);
  if (!deletedSauce) {
    return res.status(400).json({ message: "La sauce n'a pas été trouvée " });
  }
  await deletedSauce.remove();
  res.status(200).json({ message: "La sauce a été supprimée" });
});

module.exports = {
  postSauce,
  getSauce,
  getSauces,
  updateSauce,
  deleteSauce,
  postSauceLike,
};
