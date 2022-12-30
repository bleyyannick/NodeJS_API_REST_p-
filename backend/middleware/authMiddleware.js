const jwt = require("jsonwebtoken");
const passwordValidator = require("password-validator");
const validPassword = new passwordValidator();
const passwordSchema = validPassword.is().min(4).has().not().spaces();

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    if (req.body.userId && req.body.userId !== userId) {
      throw new Error("Mauvais UserId");
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

const passwordValidation = (req, res, next) => {
  if (!passwordSchema.validate(req.body.password)) {
    return res.status(403).json({
      message:
        "Le mot de passe doit contenir au moins 4 lettres ou chiffres et être sans espace.",
    });
  }
  next();
};

module.exports = {
  auth,
  passwordValidation,
};
