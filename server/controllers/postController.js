const Post = require("../models/Post");
const User = require("../models/User");
const Comments = require("../models/Comments");

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json({
      success: true,
      message: "All posts",
      count: posts.length,
      posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error at getAllPosts",
      error: err.message,
    });
  }
};

const createPost = async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      success: true,
      message: "Post created",
      post: savedPost,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error at createPost",
      error: err.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    console.log(`Error at updatePost: ${err}`);
    res.status(500).json(err);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("the post has been deleted");
    } else {
      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    console.log(`Error at deletePost: ${err}`);
    res.status(500).json(err);
  }
};

const like_unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      await User.updateOne(
        { _id: req.body.userId },
        { $push: { likedPosts: post._id } }
      );
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      await User.updateOne(
        { _id: req.body.userId },
        { $pull: { likedPosts: post._id } }
      );
      res.status(200).json("Post has been unliked");
    }
  } catch (err) {
    console.log(`Error at like_unlikePost: ${err}`);
    res.status(500).json(err);
  }
};

const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    console.log(`Error at getSinglePost: ${err}`);
    res.status(500).json(err);
  }
};

const getTimelinePosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    console.log(`Error at getTimelinePosts: ${err}`);
    res.status(500).json(err);
  }
};

const getUserPosts = async (req, res) => {
  console.log(`Username: ${req.params.username}`);
  try {
    const username = req.params.username;
    const user = await User.findOne({ username: username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    console.log(`Error at getUserPosts: ${err}`);
    res.status(500).json(err);
  }
};

// Create a new comment for a post
const createComments = async (req, res) => {
  try {
    const { postId, userId, text } = req.body;

    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Create a new comment
    const comment = new Comment({ postId, userId, text });
    await comment.save();

    // Add the comment to the post's comments array
    post.comments.push(comment);
    await post.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error(`Error at create comments: ${error}`);
    res.status(500).json({ error: "Server error at create comments." });
  }
};

const getComments = async (req, res) => {
  try {
    const postId = req.params.postId;

    // Find the post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    // Find the comments for the post
    const comments = await Comment.find({ postId: postId });
    res.status(200).json({
      success: true,
      message: `Comments for post ${postId}`,
      count: comments.length,
      comments,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error at getComments.",
      error: err.message,
    });
  }
};

module.exports = {
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
};
