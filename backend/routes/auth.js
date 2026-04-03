const express = require('express');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   GET /api/auth/force-seed
// @desc    Force create admin user (Emergency Bypass)
// @access  Public (Temporary)
router.get('/force-seed', asyncHandler(async (req, res) => {
  await User.deleteOne({ email: 'mrphoto444@gmail.com' });
  const admin = await User.create({
    email: 'mrphoto444@gmail.com',
    password: 'adminpassword123',
    role: 'admin'
  });
  res.json({ message: 'Admin completely reset! Try logging in now.', email: admin.email, password: 'adminpassword123' });
}));


// @route   POST /api/auth/login
// @desc    Auth user & get token
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // AUTO-SEED: If admin doesn't exist, create it immediately upon first login attempt
  let user = await User.findOne({ email });
  if (!user && email === 'mrphoto444@gmail.com' && password === 'adminpassword123') {
    user = await User.create({
      email: 'mrphoto444@gmail.com',
      password: 'adminpassword123',
      role: 'admin'
    });
    console.log("Auto-created admin user during login");
  } else if (!user) {
    // Fallback if generic user not found
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (await user.matchPassword(password)) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

module.exports = router;
