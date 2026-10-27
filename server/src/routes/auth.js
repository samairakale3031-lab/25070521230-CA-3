import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticate, authRateLimiter } from '../middleware/auth.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'orbit_super_secret_jwt_key_evaluation_2026_cosmic_space_ca';

// Helper to generate JWT token and cookie options
const generateTokenAndSetCookie = (res, user) => {
  const token = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  const isProduction = process.env.NODE_ENV === 'production';
  res.cookie('orbit_token', token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });

  return token;
};

// POST /api/auth/register
router.post('/register', authRateLimiter, async (req, res) => {
  try {
    const { displayName, email, password, confirmPassword } = req.body;

    // Client-side and server-side validation
    if (!displayName || !displayName.trim()) {
      return res.status(400).json({ success: false, message: 'Display name is required.' });
    }
    if (displayName.trim().length < 2 || displayName.trim().length > 50) {
      return res.status(400).json({ success: false, message: 'Display name must be between 2 and 50 characters.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Password confirmation does not match.' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check duplicate email
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email address already exists. Please log in instead.',
      });
    }

    // Secure password hashing with bcryptjs (salt rounds = 10)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      displayName: displayName.trim(),
      email: normalizedEmail,
      passwordHash,
    });

    const token = generateTokenAndSetCookie(res, newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Welcome to ORBIT.',
      user: {
        id: newUser._id,
        displayName: newUser.displayName,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during registration. Please try again later.' });
  }
});

// POST /api/auth/login
router.post('/login', authRateLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password. Please verify your credentials.',
      });
    }

    const token = generateTokenAndSetCookie(res, user);

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.displayName}!`,
      user: {
        id: user._id,
        displayName: user.displayName,
        email: user.email,
        createdAt: user.createdAt,
      },
      token,
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    res.status(500).json({ success: false, message: 'Server error during login. Please try again later.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  const isProduction = process.env.NODE_ENV === 'production';
  res.clearCookie('orbit_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/',
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      displayName: req.user.displayName,
      email: req.user.email,
      createdAt: req.user.createdAt,
    },
  });
});

export default router;
