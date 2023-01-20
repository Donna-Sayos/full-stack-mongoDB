const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const user = require("./routes/user");

dotenv.config({ path: "./server/config/config.env" });

connectDB();

const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));


app.use(logger);
app.use("/user", user);

module.exports = app;