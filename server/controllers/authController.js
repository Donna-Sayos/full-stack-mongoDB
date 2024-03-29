require("dotenv").config({ path: "./server/config/config.env" });
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    const { username, firstName, lastName, gender, pronouns, email, password } =
      req.body;
    const user = new User({
      username,
      firstName,
      lastName,
      gender,
      pronouns,
      email,
      password,
    });
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    console.error(`Error signing up: ${error.message}`);
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    //decrypt password
    const decryptedPass = user.decryptPassword();
    // Compare plain text password with hashed password
    const isMatch = await bcrypt.compare(password, decryptedPass);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }
    const token = user.getSignedJwtToken();
    res.status(200).json({
      success: true,
      token,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender,
      pronouns: user.pronouns,
      _id: user._id,
      followings: user.followings,
      desc: user.desc,
      likedPosts: user.likedPosts,
      profilePicture: user.profilePicture,
      isReading: user.isReading,
    });
  } catch (error) {
    console.error(`Error at login: ${error.message}`);
    res.status(400).json({
      success: false,
      error: "Error at login",
    });
  }
};

module.exports = {
  signup,
  login,
};
