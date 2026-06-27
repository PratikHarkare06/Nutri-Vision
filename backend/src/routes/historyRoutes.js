const express = require("express");
const { getHistory, getDailyWater, addWater } = require("../controllers/historyController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getHistory);
router.get("/water", getDailyWater);
router.post("/water", addWater);

module.exports = router;
