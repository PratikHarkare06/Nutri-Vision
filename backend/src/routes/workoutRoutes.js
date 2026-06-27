const express = require("express");
const { generateWorkoutPlan, getWorkoutPlan, completeWorkoutSession } = require("../controllers/workoutController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getWorkoutPlan);
router.post("/generate", generateWorkoutPlan);
router.post("/complete", completeWorkoutSession);

module.exports = router;
