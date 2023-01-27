require("dotenv").config({ path: "./server/config/config.env" });
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // This is a constructor function for creating new schemas
const crypto = require("crypto"); // for resetting password;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const autoIncrement = require("mongoose-auto-increment");

const initAutoIncrement = async () => {
  const lastUser = await User.findOne().sort({ userId: -1 });
  const startAt = lastUser ? lastUser.userId + 1 : 1;

  UserSchema.plugin(autoIncrement.plugin, {
    model: "User",
    field: "userId",
    startAt: startAt,
    incrementBy: 1,
  });
};

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.index({ userId: 1 }); // create index for userId;

// pre-hook;
UserSchema.pre("save", async function (next) {
  // hash the password;
  if (!this.isModified("password")) {
    // if the password is not modified, then skip this middleware;
    next();
  }
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);
});

// instance method;
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

autoIncrement.initialize(mongoose.connection);

const User = mongoose.model("User", UserSchema);

(async function () {
  await initAutoIncrement();
})();

module.exports = User;
