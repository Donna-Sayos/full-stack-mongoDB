const app = require("./server/server");
const chalk = require("chalk"); // version 4.1.0 works with require(); above that you need to use import

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
