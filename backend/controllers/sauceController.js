const asyncHandler = require("express-async-handler");
const sauceModel = require("../model/sauceModel");
// GET /api/sauces
const getSauces = asyncHandler(async (req, res) => {
  const sauces = await sauceModel.find();
  res.status(200).json(sauces);
});

//GET /api/sauces/:id
const getSauce = asyncHandler(async (req, res) => {
  const sauce = await sauceModel.findById(req.params.id);
  if (!sauce) {
    return res.status(400).json({ message: "la sauce n'a pas été trouvée" });
  }
  res.status(200).json(sauce);
});

//POST /api/sauces
const postSauce = asyncHandler(async (req, res) => {
  if (!req.body.sauce || !req.body.image) {
    res
      .status(400)
      .json({ message: "Veuillez ajouter une sauce avec une image" });
  }
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  delete sauceObj._userId;
  await sauceModel.create({
    ...sauceObj,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  res.status(201).json({ message: "Votre sauce a bien été ajouté" });
});

//POST /api/sauces/:id/like
const postSauceLike = asyncHandler(async (req, res) => {});

//PUT /api/sauces/:id
const updateSauce = asyncHandler(async (req, res) => {
  const sauceObj = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObj._userId;
  sauceModel
    .findById(req.params.id)
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({
          message:
            "Vous n'êtes pas autorisé à modifier les informations des sauces",
        });
      } else {
        sauceModel
          .findByIdAndUpdate(req.params.id, req.body, { new: true })
          .then(() =>
            res.status(200).json({ message: "la sauce a été modifiée" })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });

  // const sauce = await sauceModel.findById(req.params.id);
  // if (!sauce) {
  //   return res.status(400).json({ message: "La sauce n'a pas été trouvée " });
  // }
  // const editedSauce = await sauceModel.findByIdAndUpdate(
  //   req.params.id,
  //   req.body,
  //   { new: true }
  // );

  // res.status(200).json(editedSauce);
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
