const express = require("express");
const { generateWorkoutPlan, getWorkoutPlan, completeWorkoutSession } = require("../controllers/workoutController");

const router = express.Router();

router.get("/", getWorkoutPlan);
router.post("/generate", generateWorkoutPlan);
router.post("/complete", completeWorkoutSession);

module.exports = router;
