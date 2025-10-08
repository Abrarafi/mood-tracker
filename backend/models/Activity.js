const mongoose = require("mongoose");

const { Schema } = mongoose;

const activitySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "meditation",
        "exercise",
        "walking",
        "reading",
        "journaling",
        "therapy",
        "game",
        "breathing",
        "mood",
      ],
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    duration: {
      type: Number,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    feedback: {
      type: String,
    },
    completed: {
      type: Boolean,
      default: true,
    },
    moodScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    moodNote: {
      type: String,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
activitySchema.index({ userId: 1, timestamp: -1 });

const Activity = mongoose.model("Activity", activitySchema);
module.exports = { Activity };
