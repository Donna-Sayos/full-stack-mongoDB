const mongoose = require("mongoose");
const Schema = mongoose.Schema; // This is a constructor function for creating new schemas

const UserSchema = new Schema({ // This is a new instance of the Schema constructor
  username: {
    type: String,
    required: true,
    unique: true,
    maxLength: 20,
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
    types: Schema.Types.Date,
}
});

module.exports = mongoose.model("User", UserSchema);
