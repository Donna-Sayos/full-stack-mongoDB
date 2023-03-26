const router = require("express").Router();
const {
  newConvo,
  getConvo,
  getTwoConvos,
  incrementNotificationCount,
  getNotificationCount,
  resetNotificationCount,
} = require("../controllers/conversationsController");

router.route("/").post(newConvo);
router.route("/:userId").get(getConvo);
router.route("/find/:firstUserId/:secondUserId").get(getTwoConvos);
router
  .route("/:currentChatId/notification")
  .get(getNotificationCount)
  .post(incrementNotificationCount)
  .put(resetNotificationCount);

module.exports = router;
