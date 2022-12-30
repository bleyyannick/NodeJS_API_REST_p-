const express = require("express");
const helmet = require("helmet");
const dotenv = require("dotenv").config();
const path = require("path");
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());
app.use(helmet());
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
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", require("./routes/userRoutes"));
app.use("/api/sauces", require("./routes/sauceRoutes"));

module.exports = app;
