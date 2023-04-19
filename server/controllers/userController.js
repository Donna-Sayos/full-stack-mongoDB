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
    const uniqueFollowings = [...new Set(user.followings)]; // Remove duplicates from followings array
    const friends = await Promise.all(
      uniqueFollowings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilePicture, isReading } = friend;
      friendList.push({ _id, username, profilePicture, isReading });
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
    const user = await User.create(req.body);
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
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
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

const updateUserPhoto = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    console.log("server-side ID", userId);

    const user = await User.findOne({ _id: userId });
    if (!user) {
      console.log(`User with ID ${userId} not found`);
      return res.sendStatus(404);
    }

    const { coverPicture, profilePicture } = req.body;

    if (!coverPicture && !profilePicture) {
      console.log(`Missing coverPicture and profilePicture in request body`);
      return res
        .status(400)
        .json({ message: "Missing coverPicture or profilePicture field" });
    }

    let updateFields = {};
    if (coverPicture) {
      updateFields.coverPicture = coverPicture;
    }
    if (profilePicture) {
      updateFields.profilePicture = profilePicture;
    }

    const result = await User.updateOne(
      { _id: req.params.userId },
      updateFields
    );
    console.log("Server-side Update result: ", result);

    res.status(200).json(result);
  } catch (err) {
    console.error(
      `Server-side Error updating photo for user with ID ${req.params.userId}: ${err}`
    );
    res.sendStatus(500);
  }
};

const markAsRead = async (req, res) => { // FIXME: testing feature
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).json("user not found");
    user.isReading = true;
    await user.save();

    res.status(200).json({ message: "marked as read" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const markAsUnread = async (req, res) => { // FIXME: testing feature
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(400).json("user not found");
    user.isReading = false;
    await user.save();

    res.status(200).json({ message: "marked as unread" });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
  updateUserPhoto,
  markAsRead,
  markAsUnread,
};
