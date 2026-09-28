const mongoose = require("mongoose");
const crypto = require("crypto");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

async function registerUser({ userId, eventId }) {
  const session = await mongoose.startSession();

  try {
    let created;

    await session.withTransaction(async () => {
      const event = await Event.findOne({
        _id: eventId,
        status: "upcoming"
      }).session(session);

      if (!event) throw new Error("Event not found or registration is closed.");

      if (event.registeredCount >= event.capacity) {
        throw new Error("This event is full.");
      }

      const duplicate = await Registration.findOne({
        user: userId,
        event: eventId,
        status: { $ne: "cancelled" }
      }).session(session);

      if (duplicate) throw new Error("You are already registered for this event.");

      const ticketCode = `SW-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

      const docs = await Registration.create(
        [
          {
            user: userId,
            event: eventId,
            ticketCode
          }
        ],
        { session }
      );

      await Event.updateOne(
        { _id: eventId, registeredCount: { $lt: event.capacity } },
        { $inc: { registeredCount: 1 } },
        { session }
      );

      created = docs[0];
    });

    return created;
  } finally {
    await session.endSession();
  }
}

module.exports = { registerUser };
