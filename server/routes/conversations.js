const router = require("express").Router();
const { newConvo, getConvo, getTwoConvos } = require("../controllers/conversationsController");

router.route("/").post(newConvo);
router.route("/:userId").get(getConvo);
router.route("/find/:firstUserId/:secondUserId").get(getTwoConvos);

module.exports = router;