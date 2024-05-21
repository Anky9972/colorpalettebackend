// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
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
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  saved: {
    type: [String],
  },
  savefullpalette: {
    type: [[]],
  },
});

module.exports = mongoose.model("User", UserSchema);
