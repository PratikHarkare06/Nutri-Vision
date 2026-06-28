// authMiddleware.js — Verifies Firebase ID tokens (primary) with legacy JWT fallback
const admin = require("../config/firebaseAdmin");
const { User } = require("../models/User");
const { createAppError } = require("../utils/createAppError");

const extractToken = (req) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
};

const resolveUserFromFirebaseToken = async (token) => {
  const decoded = await admin.auth().verifyIdToken(token);
  // Find user in MongoDB by Firebase UID
  let user = await User.findOne({ firebaseUid: decoded.uid }).select("-password");
  if (!user) {
    // Auto-create user record on first hit if sync was missed
    user = await User.create({
      firebaseUid: decoded.uid,
      name: decoded.name || decoded.email?.split("@")[0] || "User",
      email: decoded.email || `${decoded.uid}@firebase.local`,
      provider: "firebase",
    });
  }
  return user;
};

// Full protection — rejects if no valid token
const protect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) {
    return next(createAppError(401, "UNAUTHORIZED", "Please log in to access this feature."));
  }

  try {
    const user = await resolveUserFromFirebaseToken(token);
    req.user = user;
    next();
  } catch (firebaseErr) {
    console.error("Firebase token verification failed:", firebaseErr.message);
    return next(createAppError(401, "UNAUTHORIZED", "Session expired. Please log in again."));
  }
};

// Optional — allows guest access, attaches user if token is valid
const optionalProtect = async (req, res, next) => {
  const token = extractToken(req);
  if (!token) return next(); // Guest — no token

  try {
    const user = await resolveUserFromFirebaseToken(token);
    req.user = user;
  } catch (err) {
    console.log("Optional auth: invalid token, proceeding as guest");
  }
  next();
};

module.exports = { protect, optionalProtect };
