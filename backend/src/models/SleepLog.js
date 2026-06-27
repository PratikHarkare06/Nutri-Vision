const mongoose = require("mongoose");

const sleepLogSchema = new mongoose.Schema(
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
    duration_hours: {
      type: Number,
      required: true,
      min: 0,
    },
    quality_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    deep_sleep_hours: {
      type: Number,
      default: 0,
      min: 0,
    },
    rem_sleep_hours: {
      type: Number,
      default: 0,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    collection: "sleep_logs",
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

sleepLogSchema.index({ userId: 1, date: 1 }, { unique: true });

const SleepLog = mongoose.models.SleepLog || mongoose.model("SleepLog", sleepLogSchema);

module.exports = { SleepLog };
