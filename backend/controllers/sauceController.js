const sauceModel = require("../model/sauceModel");
const fs = require("fs");

const DISLIKE = -1;
const LIKE = 1;
// GET /api/sauces
const getSauces = async (req, res) => {
  try {
    const sauces = await sauceModel.find();
    res.status(200).json(sauces);
  } catch (error) {
    throw new Error(error);
  }
};

//GET /api/sauces/:id
const getSauce = async (req, res) => {
  try {
    const sauce = await sauceModel.findById(req.params.id);
    if (!sauce) {
      return res.status(400).json({ message: "la sauce n'a pas été trouvée" });
    }
    res.status(200).json(sauce);
  } catch (error) {
    throw new Error(error);
  }
};

//POST /api/sauces
const postSauce = async (req, res) => {
  const objectSauce = JSON.parse(req.body.sauce);
  delete objectSauce._id;
  delete objectSauce._userId;
  const newSauce = new sauceModel({
    ...objectSauce,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  newSauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Votre sauce a bien été ajouté" });
    })
    .catch((error) => {
      throw new Error(error);
    });
};

//POST /api/sauces/:id/like
const postSauceLike = async (req, res) => {
  const { userId, like } = req.body;
  try {
    const selectedSauce = await sauceModel.findById(req.params.id);
    delete req.body.userId;
    if (like === LIKE) {
      try {
        await sauceModel.updateOne(
          { _id: req.params.id },
          { ...req.body, $inc: { likes: like }, $push: { usersLiked: userId } }
        );
        return res
          .status(200)
          .json({ message: "cet utilisateur aime la sauce" });
      } catch (error) {
        throw new Error(error);
      }
    }
    if (like === DISLIKE) {
      try {
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            $inc: { dislikes: 1 },
            $push: { usersDisliked: userId },
          }
        );
        return res
          .status(200)
          .json({ message: "cet utilisateur n'aime pas la sauce" });
      } catch (error) {
        throw new Error(error);
      }
    }

    if (selectedSauce.usersDisliked.includes(userId)) {
      try {
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            $inc: { dislikes: -1 },
            $pull: { usersDisliked: userId },
          }
        );
        return res.status(200).json({ message: "le dislike est annulé" });
      } catch (error) {
        throw new Error(error);
      }
    } else if (selectedSauce.usersLiked.includes(userId)) {
      try {
        await sauceModel.updateOne(
          { _id: req.params.id },
          {
            ...req.body,
            $inc: { likes: -1 },
            $pull: { usersLiked: userId },
          }
        );
        return res.status(200).json({ message: "le like est annulé" });
      } catch (error) {
        throw new Error(error);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
};

//PUT /api/sauces/:id
const updateSauce = async (req, res) => {
  const sauceObj = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete sauceObj._userId;
  await sauceModel
    .findById(req.params.id)
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        return res.status(401).json({
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
};

//DELETE /api/sauces/:id
const deleteSauce = async (req, res) => {
  try {
    const deletedSauce = await sauceModel.findById(req.params.id);
    if (deletedSauce.userId != req.auth.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const filename = deletedSauce.imageUrl.split("/images/")[1];
    fs.unlink(`images/${filename}`, async () => {
      try {
        await sauceModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "La sauce a été supprimée" });
      } catch (error) {
        throw new Error(error);
      }
    });
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  postSauce,
  getSauce,
  getSauces,
  updateSauce,
  deleteSauce,
  postSauceLike,
};
