// 📁 models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // 🔐 For password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

module.exports = mongoose.model("User", userSchema);
