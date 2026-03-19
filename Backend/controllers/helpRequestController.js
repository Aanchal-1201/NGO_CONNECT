const { HelpRequest, User, NGO, Notification } = require("../models/index");
const { sequelize } = require("../config/db");

/* ===============================================================
   Haversine formula — returns distance in metres between two points
   =============================================================== */
const haversineSQL = (lat, lng, maxDistance) => `
  (6371000 * ACOS(
    COS(RADIANS(${lat})) * COS(RADIANS(latitude)) *
    COS(RADIANS(longitude) - RADIANS(${lng})) +
    SIN(RADIANS(${lat})) * SIN(RADIANS(latitude))
  ))
`;

/* ================= CREATE HELP REQUEST ================= */
const createHelpRequest = async (req, res) => {
  try {
    const { helpType, description, latitude, longitude, priority } = req.body;

    if (!helpType || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!req.files || req.files.length < 1 || req.files.length > 4) {
      return res
        .status(400)
        .json({ message: "Minimum 1 and maximum 4 images allowed" });
    }

    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ message: "Only users can raise help requests" });
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const imageUrls = req.files.map((file) => `uploads/${file.filename}`);

    const helpRequest = await HelpRequest.create({
      createdById: user.id,
      username: user.username,
      helpType,
      description,
      imageUrls, // setter handles JSON.stringify
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      priority,
    });

    /* ===== FIND NEARBY NGOs with Haversine (35km) ===== */
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const nearbyNGOs = await sequelize.query(
      `SELECT id FROM NGOs
       WHERE isActive = true
       AND ${haversineSQL(lat, lng)} <= 35000`,
      { type: sequelize.QueryTypes.SELECT }
    );

    /* ===== CREATE NOTIFICATIONS ===== */
    for (const ngo of nearbyNGOs) {
      await Notification.create({
        ngoId: ngo.id,
        helpRequestId: helpRequest.id,
        message: `New ${helpType} request near your location`,
      });
    }

    res.status(201).json({
      message: "Help request created successfully",
      notifiedNGOs: nearbyNGOs.length,
      helpRequest,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createHelpRequest };
