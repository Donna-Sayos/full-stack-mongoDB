const router = require("express").Router();
const { createMessage, getMessage } = require("../controllers/messagesController");

router.route("/").post(createMessage);
router.route("/:conversationId").get(getMessage);

module.exports = router;