const Event = require("../models/Event");
const Registration = require("../models/Registration");

async function overview(req, res) {
  try {
    const [eventCount, registrationCount, upcomingCount, seats] = await Promise.all([
      Event.countDocuments(),
      Registration.countDocuments({ status: { $ne: "cancelled" } }),
      Event.countDocuments({ status: "upcoming" }),
      Event.aggregate([
        { $match: { status: "upcoming" } },
        {
          $group: {
            _id: null,
            capacity: { $sum: "$capacity" },
            registered: { $sum: "$registeredCount" }
          }
        }
      ])
    ]);

    const totals = seats[0] || { capacity: 0, registered: 0 };

    res.json({
      eventCount,
      registrationCount,
      upcomingCount,
      capacity: totals.capacity,
      registered: totals.registered,
      utilization: totals.capacity
        ? Math.round((totals.registered / totals.capacity) * 100)
        : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function eventAnalytics(req, res) {
  try {
    const rows = await Registration.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      {
        $group: {
          _id: "$event",
          registrations: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event"
        }
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 0,
          eventId: "$event._id",
          title: "$event.title",
          category: "$event.category",
          capacity: "$event.capacity",
          registrations: 1,
          utilization: {
            $round: [
              { $multiply: [{ $divide: ["$registrations", "$event.capacity"] }, 100] },
              1
            ]
          }
        }
      },
      { $sort: { registrations: -1 } }
    ]);

    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = { overview, eventAnalytics };
