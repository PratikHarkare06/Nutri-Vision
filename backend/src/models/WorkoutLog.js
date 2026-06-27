const mongoose = require("mongoose");

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String, // YYYY-MM-DD
      required: true,
      index: true,
    },
    workout_name: {
      type: String,
      required: true,
    },
    duration_mins: {
      type: Number,
      required: true,
    },
    calories_burned: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "workout_logs",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

const WorkoutLog = mongoose.models.WorkoutLog || mongoose.model("WorkoutLog", workoutLogSchema);

module.exports = { WorkoutLog };
