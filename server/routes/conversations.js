const router = require("express").Router();
const {
  newConvo,
  getConvo,
  getTwoConvos,
  incrementNotificationCount,
  getNotificationCount,
  resetNotificationCount,
  markConversationAsRead,
  markConversationAsUnread,
} = require("../controllers/conversationsController");

router.route("/").post(newConvo);
router.route("/:userId").get(getConvo);
router.route("/find/:firstUserId/:secondUserId").get(getTwoConvos);
router
  .route("/:conversationId/notification")
  .get(getNotificationCount)
  .post(incrementNotificationCount)
  .put(resetNotificationCount);
router.route("/:conversationId/markRead/:userId").put(markConversationAsRead);
router
  .route("/:conversationId/markUnread/:userId")
  .put(markConversationAsUnread);

module.exports = router;
