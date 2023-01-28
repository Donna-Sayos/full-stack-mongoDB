const router = require("express").Router();

const {
  createPost,
  updatePost,
  deletePost,
  like_unlikePost,
  getSinglePost,
  getTimelinePosts,
  getUserPosts,
} = require("../controllers/postController");

router.route("/").post(createPost);
router.route("/:id").put(updatePost).delete(deletePost);
router.route("/:id/like").put(like_unlikePost);
router.route("/:id").get(getSinglePost);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;