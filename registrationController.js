const Registration = require("../models/Registration");
const { registerUser } = require("../services/registrationService");

async function createRegistration(req, res) {
  try {
    const { userId, eventId } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ message: "userId and eventId are required." });
    }

    const registration = await registerUser({ userId, eventId });

    const populated = await Registration.findById(registration._id)
      .populate("user", "name email department year")
      .populate("event", "title venue startAt");

    res.status(201).json(populated);
  } catch (error) {
    const duplicate = error.code === 11000;
    res.status(duplicate ? 409 : 400).json({
      message: duplicate ? "You are already registered for this event." : error.message
    });
  }
}

async function getUserRegistrations(req, res) {
  try {
    const registrations = await Registration.find({ user: req.params.userId })
      .populate("event", "title category venue startAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(registrations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

module.exports = { createRegistration, getUserRegistrations };
