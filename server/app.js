const dotenv = require("dotenv");
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet"); // helps secure Express apps by setting various HTTP headers;
const multer = require("multer"); // helps parse multipart/form-data and for file uploads;
const needle = require("needle"); // helps with making HTTP requests;
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
  origin: function (origin, callback) {
    if (
      origin === "http://localhost:5001" ||
      origin === "http://localhost:8080"
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
    // helmet.contentSecurityPolicy helps with allowing or blocking loading of resources;
    directives: {
      // allows you to specify which sources are allowed or blocked for different types of resources, such as scripts, images, and styles;
      defaultSrc: ["'self'"], // the default policy is to load all resources from the same origin;
      scriptSrc: [
        // the scriptSrc directive specifies valid sources for JavaScript;
        "'self'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
      ],
    },
  })
);

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

app.use(express.static(join(__dirname, "..", "public")));

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
