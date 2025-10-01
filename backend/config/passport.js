require('dotenv').config();
const passport = require('passport');
const User = require('../models/user.model');

// require('./strategies/google.strategy')(passport);
// require('./strategies/github.strategy')(passport);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
