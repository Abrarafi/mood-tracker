const { Mood } = require("../models/Mood");
const { logger } = require("../utils/logger");

// Create a new mood entry
const createMood = async (req, res, next) => {
  try {
    const { score, note, context, activities } = req.body;
    const userId =
      req.userId || (req.user && (req.user._id || req.user.id)) || null;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const mood = new Mood({
      userId,
      score,
      note,
      context,
      activities,
      timestamp: new Date(),
    });

    await mood.save();
    logger.info(`Mood entry created for user ${userId}`);

    res.status(201).json({
      success: true,
      data: mood,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createMood };
