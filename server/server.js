const chalk = require("chalk");
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

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(chalk.magenta(`Server running on PORT: ${PORT} 🔊🔊🔊`));
});

process.on("unhandledRejection", (err) => {
  console.log(chalk.redBright(`Error: ${err.message}`));
  server.close(() => {
    process.exit(1); // terminate the node terminal; gracefully leaves the program; 0 = success, 1 = unhandled rejection
  });
});