const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { createMood } = require("../controllers/mood.controller");

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Track a new mood entry
router.post("/", createMood);

module.exports = router;
