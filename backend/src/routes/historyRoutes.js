const express = require("express");
const { getHistory, getDailyWater, addWater, logCustomMeal } = require("../controllers/historyController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getHistory);
router.get("/water", getDailyWater);
router.post("/water", addWater);
router.post("/", logCustomMeal);

module.exports = router;
