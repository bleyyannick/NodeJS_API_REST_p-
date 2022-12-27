const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    if (req.body.userId && req.body.userId !== userId) {
      throw "wrong userId";
    } else {
      next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  auth,
};
