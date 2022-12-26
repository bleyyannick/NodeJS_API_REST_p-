const express = require("express");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const path = require("path");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/sauces", require("./routes/sauceRoutes"));

module.exports = app;
