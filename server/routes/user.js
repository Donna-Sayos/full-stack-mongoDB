const router = require("express").Router();

const { getUsers, getFriends, follow, unfollow, createUser, getSingleUser, deleteUser, updateUserCoverPhoto } = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/").get(getSingleUser);
router.route("/:userId").delete(deleteUser);
router.route("/:userId/coverPicture").put(updateUserCoverPhoto);
router.route("/friends/:userId").get(getFriends);
router.route("/:userId/follow").put(follow);
router.route("/:userId/unfollow").put(unfollow);

module.exports = router;
