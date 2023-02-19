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
  createComments,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getSinglePost).put(updatePost).delete(deletePost);
router.route("/:id/comments").post(createComments);
router.route("/:id/like").put(like_unlikePost);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;
