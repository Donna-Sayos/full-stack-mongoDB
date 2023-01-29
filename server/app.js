const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet"); // helps secure Express apps by setting various HTTP headers;
const multer = require("multer"); // helps parse multipart/form-data and for file uploads;
const connectDB = require("./config/db");
const logger = require("./utils/logger");

// routes
const uploader = require("./routes/upload");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");

dotenv.config({ path: "./server/config/config.env" });

connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(morgan("dev"));

app.use(logger);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images"); // the files are saved in the "public/images" folder (relative to the root of the project)
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.use("/api/v1", upload.single("file"), uploader);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);

module.exports = {
  app,
  upload,
};
