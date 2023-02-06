const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet"); // helps secure Express apps by setting various HTTP headers;
const multer = require("multer"); // helps parse multipart/form-data and for file uploads;
const { join, extname } = require("path");
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

const corsOptions = {
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  origin: "*",
};

const app = express();

app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://www.google.com",
        "https://www.gstatic.com",
      ],
      frameSrc: ["https://www.google.com"],
    },
  })
);

app.use(logger);

app.use(express.static(join(__dirname, "..", "public")));
app.use("/images", express.static(join(__dirname, "public/images")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images"); // the files are saved in the "public/images" folder (relative to the root of the project)
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage });

app.use("/api/v1/upload", upload.single("file"), uploader);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/conversations", conversationRoute);
app.use("/api/v1/messages", messageRoute);

app.get("/", (req, res, next) =>
  res.sendFile(join(__dirname, "..", "public", "index.html"))
);

app.get("/env", async function (req, res) {
  try {
    res.status(200).json({
      API_KEY: process.env.RECAPTCHA_KEY,
    });
  } catch (err) {
    res.status(500).send(err.message || "ENV api error.");
  }
});

app.use((req, res, next) => {
  if (extname(req.path).length) {
    // if the path has an extension, then it is a file and not a route which means that it is not found;
    const err = new Error("Not found");
    err.status = 404;
    next(err);
  } else {
    next();
  }
});

app.use("*", (req, res) =>
  res.sendFile(join(__dirname, "..", "public", "index.html"))
);

app.use((err, req, res, next) => {
  // this is for handling errors;
  res.status(err.status || 500);
  console.error(err);
  res.send(err.message || "Internal server error.");
});

module.exports = {
  app,
  upload,
};
