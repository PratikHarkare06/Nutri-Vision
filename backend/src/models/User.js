// User.js — Supports both Firebase UID-based auth and legacy email/password
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // Firebase UID — primary identifier when using Firebase Auth
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true, // allows null for legacy users
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Optional for Firebase users (they authenticate via Firebase, not bcrypt)
    password: {
      type: String,
    },
    has_completed_profile: {
      type: Boolean,
      default: false,
    },
    // Provider: "firebase" or "local"
    provider: {
      type: String,
      default: "local",
      enum: ["local", "firebase"],
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    versionKey: false,
  }
);

// Encrypt password before saving (only for local users)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password (local auth only)
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
