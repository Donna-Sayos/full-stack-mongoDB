require("dotenv").config({ path: "./server/config/config.env" });
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // This is a constructor function for creating new schemas
const crypto = require("crypto"); // for resetting password;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const autoIncrement = require("mongoose-auto-increment");

autoIncrement.initialize(mongoose.connection); // initialize autoIncrement;

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

UserSchema.plugin(autoIncrement.plugin, {
  model: "User",
  field: "userId",
  startAt: 1,
  incrementBy: 1,
});

UserSchema.index({ userId: 1 }); // create index for userId;

// Encrypt the password
const encryptPassword = (password) => {
  const key = crypto.randomBytes(32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    key: key.toString("hex"),
    iv: iv.toString("hex"),
    encrypted: encrypted.toString("hex"),
  };
};

// Decrypt the password
const decryptPassword = (key, iv, encrypted) => {
  key = Buffer.from(key, "hex");
  iv = Buffer.from(iv, "hex");
  encrypted = Buffer.from(encrypted, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

// pre-hook;
UserSchema.pre("save", async function (next) {
  // hash the password;
  if (!this.isModified("password")) {
    // if the password is not modified, then skip this middleware;
    next();
  }
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);

  // encrypt the password;
  const { key, iv, encrypted } = encryptPassword(this.password);
  this.password = { key, iv, encrypted };
});

//decrypt method;
UserSchema.methods.decryptPassword = function () {
  return decryptPassword( // this returns the text version of the password;
    this.password.key,
    this.password.iv,
    this.password.encrypted
  );
};

// instance method;
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
