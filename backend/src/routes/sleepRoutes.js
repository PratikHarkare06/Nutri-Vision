const express = require("express");
const { getSleepLogs, logSleep, getSleepInsights } = require("../controllers/sleepController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getSleepLogs);
router.post("/", logSleep);
router.post("/insights", getSleepInsights);

module.exports = router;
