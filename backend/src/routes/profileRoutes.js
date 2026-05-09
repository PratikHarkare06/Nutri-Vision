const express = require("express");
const { getProfile, saveProfile, suggestMeals, generateDietPlan } = require("../controllers/profileController");

const router = express.Router();

router.get("/", getProfile);
router.post("/", saveProfile);
router.post("/suggest", suggestMeals);
router.post("/diet-plan", generateDietPlan);

module.exports = router;
