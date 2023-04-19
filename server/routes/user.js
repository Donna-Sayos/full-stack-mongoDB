const router = require("express").Router();

const {
  getUsers,
  getFriends,
  follow,
  unfollow,
  createUser,
  getSingleUser,
  deleteUser,
  updateUserPhoto,
  markAsRead,
  markAsUnread,
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:userId").get(getSingleUser).delete(deleteUser);
router.route("/:userId/userPicture").put(updateUserPhoto);
router.route("/friends/:userId").get(getFriends);
router.route("/:userId/follow").put(follow);
router.route("/:userId/unfollow").put(unfollow);
router.route("/:userId/markAsRead").put(markAsRead); // FIXME: testing feature
router.route("/:userId/markAsUnread").put(markAsUnread); // FIXME: testing feature

module.exports = router;
