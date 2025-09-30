const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const authMiddleware = async (req, res, next) => {
  try {
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.userId = req.user._id || req.user.id;
      return next();
    }

    const accessToken = req.cookies.accessToken;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.split(' ')[1];
    const token = accessToken || headerToken;

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      req.userId = decoded.userId;
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(401).json({ message: "User not found" });
      req.user = user;
      return next();
    } catch (tokenError) {
      const refreshTokenCookie = req.cookies.refreshToken;
      const refreshTokenHeader = authHeader?.split(' ')[2];
      const refreshToken = refreshTokenHeader || refreshTokenCookie;

      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token required.' });
      }

      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        req.userId = decodedRefresh.userId;
        const user = await User.findById(decodedRefresh.userId);
        if (!user) return res.status(401).json({ message: "User not found" });
        req.user = user;

        const newAccessToken = jwt.sign(
          { userId: req.userId },
          process.env.JWT_ACCESS_SECRET,
          { expiresIn: '15m' }
        );

        res.cookie('accessToken', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 15 * 60 * 1000,
        });

        return next();
      } catch (refreshTokenError) {
        return res.status(403).json({ message: 'Invalid refresh token. Authentication required.' });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error.', error: err.message });
  }
};

module.exports = authMiddleware;