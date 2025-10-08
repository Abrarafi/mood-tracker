const express = require("express");
const auth = require("../middlewares/auth.middleware");
const {
  logActivity,
  getUserActivities,
  updateActivityStatus,
} = require("../controllers/activity.controller");

const router = express.Router();

// All routes are protected with authentication
router.use(auth);

// Log a new activity
router.post("/", logActivity);

// Get user activities
router.get("/", getUserActivities);

// Update activity status
router.put("/:activityId", updateActivityStatus);

module.exports = router;
