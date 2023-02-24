require("dotenv").config({ path: "./server/config/config.env" });
const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    // query parameters
    const filter = {};
    const options = {};

    // check if req.query is empty;
    if (Object.keys(req.query).length) {
      // sortByFirstName could be "asc" or "desc";
      const { sortByFirstName, limit } = req.query;

      // set up pagination;
      if (limit) options.limit = parseInt(limit);
      // you can sort multiple fields by passing an object to sort;
      if (sortByFirstName)
        options.sort = { firstName: sortByFirstName === "asc" ? 1 : -1 }; // 1 = ascending, -1 = descending;
    }

    const result = await User.find({}, {}, options); // .find() can take 3 arguments: filter, projection, options;
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(`Error getting all users: ${err.message}`);
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendList.push({ _id, username, profilePicture });
    });
    res.status(200).json({
      status: "success",
      results: friendList.length,
      message: "friends fetched successfully",
      friends: friendList,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};

const follow = async (req, res) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const user = await User.findById(req.params.userId);
      if (!user) return res.status(400).json("user not found");

      const currentUser = await User.findById(req.body.userId);
      if (!currentUser) return res.status(400).json("current user not found");

      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({
          $push: { followings: req.params.userId },
        });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you can't follow yourself");
  }
};

const unfollow = async (req, res) => {
  if (req.body.userId !== req.params.userId) {
    try {
      const user = await User.findById(req.params.userId);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({
          $pull: { followings: req.params.userId },
        });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};

const createUser = async (req, res, next) => {
  try {
    const nextUserId = await User.nextCount();
    console.log("next UserId: ", nextUserId);
    const user = await User.create({ ...req.body, userId: nextUserId });
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 1000 * 1000 * 60
      ), // 1000 = 1 second, 60 = 1 minute;
    };

    res
      .status(201)
      .setHeader("Content-Type", "application/json")
      .cookie("token", token, options)
      .json(user);
  } catch (err) {
    throw new Error(`Error at creating user: ${err.message}`);
  }
};

const getSingleUser = async (req, res, next) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const result = await User.deleteOne({ userId: req.params.userId });
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(`Error at deleting single user: ${err.message}`);
  }
};

const updateUserCoverPhoto = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("server-side ID", userId);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.sendStatus(404);
    }

    const { coverPicture } = req.body;
    console.log("coverPicture: ", coverPicture);
    if (!coverPicture) {
      console.log(`Missing coverPicture in request body`);
      return res.status(400).json({ message: "Missing coverPicture field" });
    }

    const result = await User.updateOne({ _id: userId }, { coverPicture });
    console.log("Update result: ", result);
    if (result.nModified !== 1) {
      console.log(`Failed to update cover picture for user with ID ${userId}`);
      return res.sendStatus(500);
    }

    res.set({
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(
      `Error updating cover picture for user with ID ${req.params.userId}: ${err}`
    );
    next(err);
  }
};

module.exports = {
  getUsers,
  getFriends,
  follow,
  unfollow,
  createUser,
  getSingleUser,
  deleteUser,
  updateUserCoverPhoto,
};
