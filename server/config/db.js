const chalk = require("chalk");
const mongoose = require('mongoose');
mongoose.set("strictQuery", false);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true, // prevents deprecation warnings
            useUnifiedTopology: true, // prevents deprecation warnings
        });

        console.log(chalk.yellow(`MongoDB connected: ${conn.connection.host}`));
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB;