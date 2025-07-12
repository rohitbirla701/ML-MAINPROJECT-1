const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;
const CLIENT_URL = process.env.CLIENT_URL;

exports.registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, password: hashedPassword });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10h" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, fullName: user.fullName, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email & password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      message: "Login successful",
      user: { id: user._id, fullName: user.fullName, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetLink = `${CLIENT_URL}/reset-password/${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `\"ML Monitor\" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Reset your password",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });

    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ success: false, message: "Invalid or expired token" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


















// // 📁 controllers/authController.js
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const JWT_SECRET = process.env.JWT_SECRET;
// const CLIENT_URL = process.env.CLIENT_URL;

// // Register
// exports.registerUser = async (req, res) => {
//   const { fullName, email, password } = req.body;
//   try {
//     if (!fullName || !email || !password)
//       return res.status(400).json({ success: false, message: "All fields required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ success: false, message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({ fullName, email, password: hashedPassword });

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "10h" });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: { id: user._id, fullName: user.fullName, email: user.email },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Login
// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password)
//       return res.status(400).json({ success: false, message: "Email & password required" });

//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ success: false, message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

//     res.json({
//       success: true,
//       message: "Login successful",
//       user: { id: user._id, fullName: user.fullName, email: user.email },
//       token,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // Forgot Password - Send Email
// exports.forgotPassword = async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(404).json({ success: false, message: "User not found" });

//     const token = crypto.randomBytes(32).toString("hex");
//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     const resetLink = `${CLIENT_URL}/reset-password/${token}`;

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
      
//     });
//     console.log("Gmail", process.env.EMAIL_USER);
//     console.log("App Password", process.env.EMAIL_PASS);


//     await transporter.sendMail({
//       from: `"ML Monitor 👨‍⚕️" <${process.env.EMAIL_USER}>`,
//       to: user.email,
//       subject: "Reset your password",
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
//     });

//     res.json({ success: true, message: "Reset link sent to your email" });
//   } catch (err) {
//     console.error("Forgot Password Error:", err);
//     res.status(500).json({ success: false, message: "Email sending failed" });
//   }
// };

// // Reset Password
// exports.resetPassword = async (req, res) => {
//   const { token } = req.params;
//   const { password } = req.body;

//   try {
//     const user = await User.findOne({
//       resetPasswordToken: token,
//       resetPasswordExpires: { $gt: Date.now() },
//     });

//     if (!user)
//       return res.status(400).json({ success: false, message: "Invalid or expired token" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     user.password = hashedPassword;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ success: true, message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
