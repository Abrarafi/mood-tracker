const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const generateTokens = require('../utils/generateTokens');
const { hashPassword, comparePassword, sanitizeUser } = require('../utils/userUtils');
const validator = require('validator');
const passport = require('../config/passport');

const cookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost', // explicitly set domain for localhost
});

const validateRegistration = (username, email, password) => {
  if (!username || !email || !password) {
    return { valid: false, message: 'Please fill in all required fields' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }

  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must include at least one number' };
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must include at least one special character' };
  }

  return { valid: true };
};

const validateLogin = (email, password) => {
  if (!email || !password) {
    return { valid: false, message: 'Please enter both email and password' };
  }

  if (!validator.isEmail(email)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }

  return { valid: true };
};

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const validation = validateRegistration(username, email, password);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ 
      username, 
      email, 
      password: hashedPassword,
      passwordChangedAt: Date.now() - 1000
    });
    const { accessToken, refreshToken } = generateTokens(newUser._id);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] User registered: ${email} (ID: ${newUser._id})`);

    res.status(201).json({
      message: 'Account created successfully! Welcome aboard!',
      user: sanitizeUser(newUser),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(`[AUTH] Registration error: ${error.message}`);
    res.status(500).json({ message: 'Unable to create account. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const validation = validateLogin(email, password);
    if (!validation.valid) {
      return res.status(400).json({ message: validation.message });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    user.lastLogin = Date.now();
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] User logged in: ${email} (ID: ${user._id})`);

    res.status(200).json({
      message: 'Welcome back! You have been logged in successfully.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error(`[AUTH] Login error: ${error.message}`);
    res.status(500).json({ message: 'Unable to log in. Please try again.' });
  }
};

exports.logout = (req, res) => {
  try {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    req.logout((error) => {
      if (error) {
        console.error(`[AUTH] Logout error: ${error.message}`);
        return res.status(500).json({ message: 'Unable to log out. Please try again.' });
      }

      const userInfo = req.user?.email || req.userId || 'anonymous';
      console.log(`[AUTH] User logged out: ${userInfo}`);

      res.status(200).json({ message: 'You have been logged out successfully.' });
    });
  } catch (error) {
    console.error(`[AUTH] Logout error: ${error.message}`);
    res.status(500).json({ message: 'Unable to log out. Please try again.' });
  }
};

exports.refreshToken = (req, res) => {
  try {
    const refreshTokenFromClient = req.cookies.refreshToken;

    if (!refreshTokenFromClient) {
      return res.status(403).json({ message: 'Session expired. Please log in again.' });
    }

    const decoded = jwt.verify(refreshTokenFromClient, process.env.JWT_REFRESH_SECRET);
    const { accessToken, refreshToken } = generateTokens(decoded.userId);

    res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
    res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));

    console.log(`[AUTH] Tokens refreshed for user: ${decoded.userId}`);

    res.status(200).json({ message: 'Session refreshed successfully.' });
  } catch (error) {
    console.error(`[AUTH] Token refresh error: ${error.message}`);
    res.status(403).json({ message: 'Session expired. Please log in again.' });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User account not found.' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(`[AUTH] Get current user error: ${error.message}`);
    res.status(500).json({ message: 'Unable to retrieve user information.' });
  }
};