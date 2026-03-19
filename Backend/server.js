require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB, sequelize } = require("./config/db.js");
const path = require("path");

// Import models so Sequelize registers them + associations
require("./models/index");

// Routes
const authRoutes = require("./routes/authRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const helpRequestRoutes = require("./routes/helpRequestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const ngoDashboardRoutes = require("./routes/ngoDashboardRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/ngo", ngoDashboardRoutes);
app.use("/api/ai", aiRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 NGO Connect API Running...");
});

// Connect DB then sync tables, then start server
const start = async () => {
  await connectDB();
  // alter:true safely updates tables if models change; use force:true to drop & recreate
  await sequelize.sync({ alter: true });
  console.log("✅ All tables synced");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

start();
