const asyncHandler = require("express-async-handler");
const sauceModel = require("../model/sauceModel");
const fs = require("fs");
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
  const { sauce } = req.body;
  if (!sauce || !req.file) {
    res.status(400).json({ message: "faute" });
  }
  const sauceObj = JSON.parse(sauce);
  delete sauceObj._id;
  delete sauceObj._userId;
  await sauceModel.create({
    ...sauceObj,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
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
  delete sauceObj._id;
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
          .findByIdAndUpdate(req.params.id, sauceObj, { new: true })
          .then(() =>
            res.status(200).json({ message: "la sauce a été modifiée" })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
});

//DELETE /api/sauces/:id
const deleteSauce = asyncHandler(async (req, res) => {
  const deletedSauce = await sauceModel.findById(req.params.id);
  if (deletedSauce.userId !== req.auth.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  const filename = deletedSauce.imageUrl.split("/images/")[1];
  fs.unlink(`images/${filename}`, async () => {
    await sauceModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "La sauce a été supprimée" });
  });
});

module.exports = {
  postSauce,
  getSauce,
  getSauces,
  updateSauce,
  deleteSauce,
  postSauceLike,
};
