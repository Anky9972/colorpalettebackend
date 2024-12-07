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
    required: function() {
      return this.authMethod === 'local';
    }
  },
  authMethod: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  resetPasswordToken: { 
    type: String 
  },
  resetPasswordExpires: { 
    type: Date 
  },
  saved: {
    type: [String],
  },
  savefullpalette: {
    type: [[]],
  }
});

module.exports = mongoose.model("User", UserSchema);