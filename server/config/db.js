const chalk = require("chalk");
const mongoose = require('mongoose');
mongoose.set("strictQuery", false); // this is to prevent deprecation warnings

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true, // prevents deprecation warnings
            useUnifiedTopology: true, // prevents deprecation warnings
        });

        console.log(chalk.blue(`MongoDB connected: ${conn.connection.host}`));
    } catch (err) {
        console.error(err);
        process.exit(1); // terminate the node terminal; gracefully leaves the program; 0 = success, 1 = unhandled rejection
    }
};

module.exports = connectDB;