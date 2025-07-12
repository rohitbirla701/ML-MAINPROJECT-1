// 📁 routes/authRoutes.js
const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;








// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');  // Your Mongoose user model
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const JWT_SECRET = process.env.JWT_SECRET;
// if (!JWT_SECRET) {
//   throw new Error('JWT_SECRET is not set in environment variables.');
// }

// router.post("/register", async (req, res) => {
//   try {
//     const { fullName, email, password } = req.body;
//     console.log("Register received:", req.body); // 🟡 DEBUG

//     // ✅ Check all required fields
//     if (!fullName || !email || !password) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     // ✅ Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User already registered",
//       });
//     }

    
//     // ✅ Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//      // ✅ Create new user
//     const newUser = new User({
//       fullName,
//       email,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '10h' });

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         id: newUser._id,
//         fullName: newUser.fullName,
//         email: newUser.email,
//       },
//       token,
//     });
//   } catch (error) {
//   console.error("Register error:", error.response?.data || error.message);
//   res.status(400).json({ message: error.message });

// }
// });

// router.post('/login', async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ success: false, message: 'Email and password are required' });
//     }

//     // ✅ Find user by email
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' });
//     }

//     // ✅ Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ success: false, message: 'Invalid credentials' });
//     }

//     // ✅ Generate token
//     const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });

//     return res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       user: { id: user._id, fullName: user.fullName, email: user.email },
//       token,
//     });


//   } catch (err) {
//     console.error('Login error:', err.message);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// });




// module.exports = router;

















// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");

// const users = []; // Temporary in-memory store

// // Register route
// router.post("/register", (req, res) => {
//   const { fullName, email, password } = req.body;

//   if (!fullName || !email || !password) {
//     return res.status(400).json({ success: false, message: "All fields are required." });
//   }

//   const existingUser = users.find(user => user.email === email);
//   if (existingUser) {
//     return res.status(400).json({ success: false, message: "User already exists." });
//   }

//   users.push({ fullName, email, password });
//   return res.json({ success: true, message: "Registration successful." });
// });

// // Login route
// router.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   const user = users.find(u => u.email === email && u.password === password);
//   if (!user) {
//     return res.status(401).json({ success: false, message: "Invalid email or password." });
//   }

//   const token = jwt.sign({ email: user.email, fullName: user.fullName }, "secret123", {
//     expiresIn: "1h",
//   });

//   return res.json({
//     success: true,
//     token,
//     user: { email: user.email, fullName: user.fullName },
//   });
// });

// module.exports = router;
