const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const auth = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
  const userId = decodedToken.userId;
  req.auth = {
    userId: userId,
  };
  next();
});

module.exports = {
  auth,
};
