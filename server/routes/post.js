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
  getComments,
  deleteComment,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:postId").get(getSinglePost).put(updatePost).delete(deletePost);
router.route("/:postId/comments").get(getComments).post(createComments);
router.route("/:postId/comments/:commentId").delete(deleteComment);
router.route("/:postId/like").put(like_unlikePost);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;
