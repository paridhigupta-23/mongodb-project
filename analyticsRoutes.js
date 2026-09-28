const router = require("express").Router();
const {
  overview,
  eventAnalytics
} = require("../controllers/analyticsController");

router.get("/overview", overview);
router.get("/events", eventAnalytics);

module.exports = router;
