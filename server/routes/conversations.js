const router = require("express").Router();
const {
  newConvo,
  getConvo,
  getTwoConvos,
  incrementNotificationCount,
} = require("../controllers/conversationsController");

router.route("/").post(newConvo);
router.route("/:userId").get(getConvo);
router.route("/find/:firstUserId/:secondUserId").get(getTwoConvos);
router.route("/:currentChatId/notification").post(incrementNotificationCount);

module.exports = router;
