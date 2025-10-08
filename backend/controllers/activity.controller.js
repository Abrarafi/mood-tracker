const { Activity } = require("../models/Activity");

// Log a new activity
const logActivity = async (req, res) => {
  try {
    const {
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      completed,
      moodScore,
      moodNote,
    } = req.body;
    const userId = req.userId; // from auth middleware

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = await Activity.create({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      completed: completed !== undefined ? completed : true,
      moodScore,
      moodNote,
      timestamp: new Date(),
    });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error logging activity:", error);
    res.status(500).json({ message: "Failed to log activity" });
  }
};

// Get user activities
const getUserActivities = async (req, res) => {
  try {
    const userId = req.userId;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const activities = await Activity.find({
      userId,
      timestamp: { $gte: startDate },
    }).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ message: "Failed to fetch activities" });
  }
};

// Update activity status
const updateActivityStatus = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { completed, moodScore, moodNote } = req.body;
    const userId = req.userId;

    const activity = await Activity.findOneAndUpdate(
      { _id: activityId, userId },
      { completed, moodScore, moodNote },
      { new: true }
    );

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    console.error("Error updating activity:", error);
    res.status(500).json({ message: "Failed to update activity" });
  }
};

module.exports = {
  logActivity,
  getUserActivities,
  updateActivityStatus,
};
