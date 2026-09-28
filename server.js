require("dotenv").config();

const path = require("path");
const express = require("express");
const connectDB = require("./src/config/db");

const eventRoutes = require("./src/routes/eventRoutes");
const registrationRoutes = require("./src/routes/registrationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "StackWorks Campus Connect" });
});

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

async function start() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`StackWorks running at http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Startup failed:", error.message);
  process.exit(1);
});
