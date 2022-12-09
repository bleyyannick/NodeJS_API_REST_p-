const mongoose = require("mongoose");

const sauceSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    mainPepper: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    heat: {
      type: Number,
      required: true,
    },
    likes: {
      type: Number,
      required: true,
    },
    dislikes: {
      type: Number,
      required: true,
    },
    usersLiked: {
      type: userId,
      required: true,
    },
    usersDisliked: {
      type: userId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sauce", sauceSchema);
