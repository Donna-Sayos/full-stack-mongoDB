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
      if (sortByFirstName) options.sort = { firstName: sortByFirstName === "asc" ? 1 : -1 }; // 1 = ascending, -1 = descending;
    }

    const result = await User.find({}, {}, options); // .find() can take 3 arguments: filter, projection, options;
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(`Error getting all users: ${err.message}`);
  }
};

const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = user.getSignedJwtToken();

    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 1000 * 60), // 1000 = 1 second, 60 = 1 minute;
    };

    res.status(201).setHeader("Content-Type", "application/json").cookie("token", token, options).json(user);
  } catch (err) {
    throw new Error(`Error at creating user: ${err.message}`);
  }
};

const getSingleUser = async (req, res, next) => {
  try {
    const result = await User.findOne({ userId: req.params.userId });
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(`Error at getting single user: ${err.message}`);
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

const updateUser = async (req, res, next) => {
  try {
    const result = await User.updateOne({ userId: req.params.userId }, req.body);
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(`Error at updating single user: ${err.message}`);
  }
};

module.exports = {
  getUsers,
  createUser,
  getSingleUser,
  deleteUser,
  updateUser,
};
