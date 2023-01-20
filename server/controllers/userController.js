const chalk = require("chalk");
const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const result = await User.find();
    res.status(200).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(chalk.bgRedBright(`Error getting all users: ${err.message}`));
  }
};

const createUser = async (req, res, next) => {
  try {
    const result = await User.create(req.body);
    res.status(201).setHeader("Content-Type", "application/json").json(result);
  } catch (err) {
    throw new Error(chalk.bgRedBright(`Error at creating user: ${err.message}`));
  }
};

// const deleteUsers = async (req, res, next) => {

// };

// const getUser = async (req, res, next) => {

// }

module.exports = {
  getUsers,
  createUser,
};
