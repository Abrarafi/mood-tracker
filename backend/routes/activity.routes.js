const express = require("express");
const auth = require("../middlewares/auth.middleware");
const { logActivity } = require("../controllers/activity.controller");

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", logActivity);

module.exports = router;
