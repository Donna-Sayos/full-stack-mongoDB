const chalk = require("chalk");

const logger = (req, res, next) => { 
  console.log(
    chalk.greenBright(
      `${req.method} ${req.protocol}://${req.get("host")}${req.originalUrl}`
    )
  ); // for example: GET http://localhost:5000/api/users
  next();
};

module.exports = logger;
