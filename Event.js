const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ["Technology", "Design", "Business", "Community", "Workshop"]
    },
    venue: { type: String, required: true },
    startAt: { type: Date, required: true, index: true },
    capacity: { type: Number, required: true, min: 1 },
    registeredCount: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["upcoming", "completed", "cancelled"],
      default: "upcoming",
      index: true
    }
  },
  { timestamps: true }
);

eventSchema.index({ category: 1, status: 1, startAt: 1 });

module.exports = mongoose.model("Event", eventSchema);
