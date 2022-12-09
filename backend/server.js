const express = require("express");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use("/api/sauces", require("./routes/sauceRoutes"));
app.use("/api/auth/", require("./routes/userRoutes"));
