const router = require("express").Router();
const {
  createRegistration,
  getUserRegistrations
} = require("../controllers/registrationController");

router.post("/", createRegistration);
router.get("/user/:userId", getUserRegistrations);

module.exports = router;
