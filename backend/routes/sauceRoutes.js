const express = require("express");
const {
  getSauces,
  postSauce,
  getSauce,
  updateSauce,
  deleteSauce,
  postSauceLike,
} = require("../controllers/sauceController");
const { auth } = require("../middleware/authMiddleware");
const multer = require("../middleware/multer-config");

const router = express.Router();

router.route("/").get(auth, getSauces).post(auth, multer, postSauce);
router
  .route("/:id")
  .get(auth, getSauce)
  .put(auth, multer, updateSauce)
  .delete(auth, deleteSauce);

router.route.get("/:id/like").post(auth, postSauceLike);
module.exports = router;
