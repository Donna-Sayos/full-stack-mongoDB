const router = require("express").Router();
const upload = require("../app");
const { uploadFile } = require("../controllers/uploadController");

router.route("/").post(uploadFile);

module.exports = router;