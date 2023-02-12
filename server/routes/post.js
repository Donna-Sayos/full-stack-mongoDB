const router = require("express").Router();

const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
  like_unlikePost,
  getSinglePost,
  getTimelinePosts,
  getUserPosts,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").put(updatePost);
router.route("/:id").delete(deletePost);
router.route("/:id/like").put(like_unlikePost);
router.route("/:id").get(getSinglePost);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;