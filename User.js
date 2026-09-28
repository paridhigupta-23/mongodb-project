const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
    year: { type: Number, required: true, min: 1, max: 6 },
    role: { type: String, enum: ["student", "organizer"], default: "student" }
  },
  { timestamps: true }
);

userSchema.index({ department: 1, year: 1 });

module.exports = mongoose.model("User", userSchema);
