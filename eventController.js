const Event = require("../models/Event");

async function listEvents(req, res) {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.status) filter.status = req.query.status;

    const events = await Event.find(filter)
      .sort({ startAt: 1 })
      .lean();

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getEvent(req, res) {
  try {
    const event = await Event.findById(req.params.id).lean();
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: "Invalid event id" });
  }
}

module.exports = { listEvents, getEvent };
