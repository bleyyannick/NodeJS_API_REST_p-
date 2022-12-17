const express = require("express");
const helmet = require("helmet");
const colors = require("colors");
const dotenv = require("dotenv").config();
const port = process.env.PORT || 3000;
const connectDB = require("./config/db");

connectDB();

const app = express();

app.use(express.json());
app.use(helmet());

app.use("/api/sauces", require("./routes/sauceRoutes"));
app.use("/api/auth", require("./routes/userRoutes"));

app.listen(port, console.log(`Server started on ${port}`));

module.exports = app;
