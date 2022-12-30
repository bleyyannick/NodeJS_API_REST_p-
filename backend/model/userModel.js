const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { isEmail } = require("validator");
const userModel = mongoose.Schema({
  email: {
    type: String,
    validate: {
      validator: isEmail,
      message: "Veuillez entrer une adresse mail valide",
      isAsync: false,
    },
    required: [true, "Veuillez entrer une adresse mail"],
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userModel.plugin(uniqueValidator);

module.exports = mongoose.model("User", userModel);
