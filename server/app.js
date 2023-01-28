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
const auth = require("./routes/auth");
const user = require("./routes/user");

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
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.use("/api/v1", upload.single("file"), uploader);
app.use("/api/v1/auth", auth);
app.use("/api/v1/user", user);

module.exports = {
  app,
  upload,
};
