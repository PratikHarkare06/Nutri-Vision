// authRoutes.js — Firebase-compatible auth endpoints
const express = require("express");
const { syncFirebaseUser, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/sync — called after Firebase sign-in to upsert user in MongoDB
router.post("/sync", syncFirebaseUser);

// GET /api/auth/me — returns current authenticated user info
router.get("/me", protect, getMe);

module.exports = router;
