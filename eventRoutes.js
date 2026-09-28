const router = require("express").Router();
const { listEvents, getEvent } = require("../controllers/eventController");

router.get("/", listEvents);
router.get("/:id", getEvent);

module.exports = router;
