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
  deleteComments,
} = require("../controllers/postController");

router.route("/").get(getAllPosts).post(createPost);
router.route("/:id").get(getSinglePost).put(updatePost).delete(deletePost);
router
  .route("/:id/comments")
  .get(getComments)
  .post(createComments)
  .delete(deleteComments);
router.route("/:id/like").put(like_unlikePost);
router.route("/timeline/:userId").get(getTimelinePosts);
router.route("/profile/:username").get(getUserPosts);

module.exports = router;
