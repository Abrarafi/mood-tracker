import { Activity } from "../models/Activity.js";
import { logger } from "../utils/logger.js";
// import { sendActivityCompletionEvent } from "../utils/inngestEvents.js";

// Log a new activity
export const logActivity = async (req, res, next) => {
  try {
    const { type, name, description, duration, difficulty, feedback } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const activity = new Activity({
      userId,
      type,
      name,
      description,
      duration,
      difficulty,
      feedback,
      timestamp: new Date(),
    });

    await activity.save();
    logger.info(`Activity logged for user ${userId}`);

    // Send activity completion event to Inngest
    // await sendActivityCompletionEvent({
    //   userId,
    //   id: activity._id,
    //   type,
    //   name,
    //   duration,
    //   difficulty,
    //   feedback,
    //   timestamp: activity.timestamp,
    // });

    res.status(201).json({
      success: true,
      data: activity,
    });
  } catch (error) {
    next(error);
  }
};
