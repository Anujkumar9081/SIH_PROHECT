const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @route   POST /api/signup
// @desc    Register new user
// @access  Public
router.post('/signup', async (req, res) => {
  try {
    const { badgeId, password, name, state, district, role, department } = req.body;

    if (!badgeId || !password || !name || !state || !district) {
      return res.status(400).json({ error: 'All core fields are required (badgeId, password, name, state, district)' });
    }

    // Check if user exists
    const userExists = await User.findOne({ badgeId });

    if (userExists) {
      return res.status(400).json({ error: 'Badge ID already registered' });
    }

    // Create user
    const user = await User.create({
      badgeId,
      password,
      name,
      state,
      district,
      role: role || 'Enforcement Officer',
      department: department || 'Dept. of Legal Metrology',
    });

    if (user) {
      res.status(201).json({
        user: {
          _id: user._id,
          badgeId: user.badgeId,
          name: user.name,
          state: user.state,
          district: user.district,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ error: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
});

// @route   POST /api/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { badgeId, password } = req.body;

    // Check for user badgeId
    const user = await User.findOne({ badgeId });

    if (user && (await user.matchPassword(password))) {
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      res.json({
        user: {
          _id: user._id,
          badgeId: user.badgeId,
          name: user.name,
          state: user.state,
          district: user.district,
          role: user.role,
        },
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ error: 'Invalid badge ID or password' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server Error: ' + error.message });
  }
});

module.exports = router;
