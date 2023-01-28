require("dotenv").config({ path: "./server/config/config.env" });
const User = require("../models/User");

const signup = async (req, res, next) => {
  try {
    const { username, firstName, lastName, gender, email, password } = req.body;
    const userId = await User.nextCount();
    const user = new User({
      username,
      firstName,
      lastName,
      gender,
      email,
      password,
      userId,
    });
    const savedUser = await user.save();
    res.status(201).json({
      success: true,
      data: savedUser,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  try {
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
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  signup,
  login,
};
