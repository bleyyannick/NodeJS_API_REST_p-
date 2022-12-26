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

router.put("/:id", auth, multer, updateSauce);
router.get("/:id", auth, getSauce);
router.delete("/:id", auth, deleteSauce);
router.get("/", auth, getSauces);
router.post("/", auth, multer, postSauce);
router.post("/:id/like", auth, postSauceLike);
module.exports = router;
