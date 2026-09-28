require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");
const Event = require("./models/Event");
const Registration = require("./models/Registration");

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Event.deleteMany({}),
    Registration.deleteMany({})
  ]);

  const users = await User.insertMany([
    {
      name: "Aarav Mehta",
      email: "aarav@example.com",
      department: "CSE",
      year: 2
    },
    {
      name: "Diya Sharma",
      email: "diya@example.com",
      department: "ECE",
      year: 3
    },
    {
      name: "Rohan Kumar",
      email: "rohan@example.com",
      department: "CSE",
      year: 1
    }
  ]);

  const now = new Date();
  const events = await Event.insertMany([
    {
      title: "MongoDB Fundamentals Lab",
      description: "Hands-on workshop covering documents, indexes and aggregation.",
      category: "Technology",
      venue: "Innovation Lab",
      startAt: new Date(now.getTime() + 2 * 86400000),
      capacity: 80
    },
    {
      title: "Build for Change",
      description: "Prototype ideas that address practical campus problems.",
      category: "Community",
      venue: "Seminar Hall 2",
      startAt: new Date(now.getTime() + 5 * 86400000),
      capacity: 120
    },
    {
      title: "UI/UX Sprint",
      description: "A focused design sprint for student product teams.",
      category: "Design",
      venue: "Design Studio",
      startAt: new Date(now.getTime() + 8 * 86400000),
      capacity: 60
    },
    {
      title: "Startup Canvas Workshop",
      description: "Learn to turn a campus idea into a structured product concept.",
      category: "Business",
      venue: "Incubation Centre",
      startAt: new Date(now.getTime() + 12 * 86400000),
      capacity: 70
    }
  ]);

  console.log(`Seeded ${users.length} users and ${events.length} events.`);
  console.log("Demo student IDs:");
  users.forEach((user) => console.log(`${user.name}: ${user._id}`));
  console.log("Demo event IDs:");
  events.forEach((event) => console.log(`${event.title}: ${event._id}`));

  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
