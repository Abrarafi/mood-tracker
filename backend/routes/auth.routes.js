const express = require("express");
const { register, login, logout, refreshToken } = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.post('/refresh-token', controller.refreshToken);
router.post("/refresh-token", refreshToken);

router.get("/logout", authMiddleware, logout);
router.get("/me", authMiddleware, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
