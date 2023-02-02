require("dotenv").config({ path: "./server/config/config.env" });
const User = require("../models/User");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    const { username, firstName, lastName, gender, pronouns, email, password } =
      req.body;
    const userId = await User.nextCount();
    const user = new User({
      username,
      firstName,
      lastName,
      gender,
      pronouns,
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
    console.log(req.body);
    const { email, password } = req.body;
    console.log(`Email: ${email}`);
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }
    //decrypt password
    const decryptedPass = user.decryptPassword();
    console.log(`Decrypted password: ${decryptedPass}`);
    // Compare plain text password with hashed password
    const isMatch = await bcrypt.compare(password, decryptedPass);
    console.log(`Password match: ${isMatch}`);
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
    console.error(error);
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
