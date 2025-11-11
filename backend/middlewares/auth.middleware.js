const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    // ✅ Passport session fallback (optional)
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.userId = req.user._id || req.user.id;
      return next();
    }

    // ✅ Get token from cookies or Authorization header
    const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      // ✅ Verify access token
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.userId = decoded.userId;

      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = user;
      return next();
    } catch (err) {
      // ❗ Token expired → try refresh token
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.status(403).json({ message: 'Session expired. Please log in again.' });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decodedRefresh.userId);

        if (!user) {
          return res.status(401).json({ message: 'User not found' });
        }

        req.userId = user._id;
        req.user = user;

        // ✅ Issue new access token
        const newAccessToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
          maxAge: 15 * 60 * 1000,
          path: '/',
        });

        return next();
      } catch (refreshError) {
        return res.status(403).json({ message: 'Invalid refresh token. Please log in again.' });
      }
    }
  } catch (err) {
    console.error('[AUTH MIDDLEWARE ERROR]', err);
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

module.exports = authMiddleware;
