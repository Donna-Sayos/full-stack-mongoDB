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
} = require("../controllers/userController");

router.route("/").get(getUsers).post(createUser);
router.route("/:userId").get(getSingleUser).delete(deleteUser);
router.route("/:userId/userPicture").put(updateUserPhoto);
router.route("/friends/:userId").get(getFriends);
router.route("/:userId/follow").put(follow);
router.route("/:userId/unfollow").put(unfollow);

module.exports = router;
