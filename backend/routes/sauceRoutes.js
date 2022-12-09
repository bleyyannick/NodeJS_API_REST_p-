const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

router.get("/:id", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

router.post("/", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

router.post("/:id/like", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

router.put("/:id", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

router.delete("/id", (req, res) => {
  res.status(200).json({ message: "Create a sauce" });
});

module.exports = router;
