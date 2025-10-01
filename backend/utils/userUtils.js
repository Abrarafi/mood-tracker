const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (candidatePassword, hashedPassword) => {
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

const getAuthProvider = (user) => {
  if (user.googleId) return 'google';
  if (user.githubId) return 'github';
  return 'local';
};

const sanitizeUser = (user) => {
  const userObj = user.toJSON ? user.toJSON() : user.toObject();
  delete userObj.password;
  delete userObj.passwordChangedAt;
  delete userObj.passwordResetToken;
  delete userObj.passwordResetExpires;
  delete userObj.__v;
  return userObj;
};

module.exports = {
  hashPassword,
  comparePassword,
  getAuthProvider,
  sanitizeUser
}; 