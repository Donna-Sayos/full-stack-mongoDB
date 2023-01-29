require("dotenv").config({ path: "./server/config/config.env" });
const mongoose = require("mongoose");
const Schema = mongoose.Schema; // This is a constructor function for creating new schemas
const crypto = require("crypto"); // for resetting password;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 3,
      max: 20,
      unique: true,
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
      enum: [
        "male",
        "female",
        "non-binary",
        "transgender",
        "other", // please specify
        "prefer not to say",
      ],
    },
    pronouns: {
      type: String,
      enum: [
        "he/him",
        "she/her",
        "they/them",
      ]
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    iv: {
      type: String,
    },
    userId: {
      type: Number,
      unique: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true }
);

UserSchema.index({ userId: 1 }); // create index for userId;

// this is for auto-incrementing the userId based on the last userId;
UserSchema.statics.nextCount = async function () {
  const count = await this.countDocuments();
  if (count === 0) {
    return 1;
  }
  const lastUser = await this.findOne().sort({ userId: -1 });
  return lastUser.userId + 1;
};

// Encrypt the password; encrypt means to convert the password into a string of characters that cannot be read;
const encryptPassword = (password) => {
  const key = process.env.ENCRYPT_KEY; // key is used to encrypt and decrypt the data and is kept secret;
  const iv = crypto.randomBytes(16); // IV (initialization vector) is a random value that is used to initialize the encryption algorithm and is typically sent along with the ciphertext;
  // "aes-256-cbc" is the algorithm used to encrypt the password;
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(password);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString("hex"),
    encrypted: encrypted.toString("hex"),
  };
};

// Decrypt the password
const decryptPassword = (key, iv, encrypted) => {
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
  const { iv, encrypted } = encryptPassword(this.password);
  this.password = encrypted;
  this.iv = iv;
});

//decrypt method;
UserSchema.methods.decryptPassword = function () {
  return decryptPassword(
    process.env.ENCRYPT_KEY,
    this.iv,
    this.password.encrypted
  ); // this returns the decrypted password;
};

// instance method;
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
