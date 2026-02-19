require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const path = require("path");

// Routes
const authRoutes = require("./routes/authRoutes");
const ngoRoutes = require("./routes/ngoRoutes");
const helpRequestRoutes = require("./routes/helpRequestRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const adminSettingsRoutes = require("./routes/adminSettingsRoutes");
const ngoDashboardRoutes = require("./routes/ngoDashboardRoutes");


const app = express();
const PORT = process.env.PORT || 8080;

// Connect Database
connectDB();

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


// Test Route
app.get("/", (req, res) => {
  res.send("🚀 NGO Connect API Running...");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
