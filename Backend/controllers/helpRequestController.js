const HelpRequest = require("../models/helpRequestModel");
const User = require("../models/userModel");
const NGO = require("../models/ngoModel");
const Notification = require("../models/notificationModel");

/* ================= CREATE HELP REQUEST ================= */
const createHelpRequest = async (req, res) => {
  try {
    const { helpType, description, latitude, longitude, priority } = req.body;

    /* ================= BASIC VALIDATION ================= */
    if (!helpType || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    /* ================= IMAGE VALIDATION ================= */
    if (!req.files || req.files.length < 1 || req.files.length > 4) {
      return res.status(400).json({
        message: "Minimum 1 and maximum 4 images allowed",
      });
    }

    /* ================= ROLE CHECK ================= */
    if (req.user.role !== "user") {
      return res.status(403).json({
        message: "Only users can raise help requests",
      });
    }

    /* ================= USER FETCH ================= */
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    /* ================= IMAGE MAP ================= */
    const imageUrls = req.files.map((file) => {
      return `uploads/${file.filename}`;
    });

    /* ================= CREATE HELP REQUEST ================= */
    const helpRequest = await HelpRequest.create({
      createdBy: user._id,
      username: user.username,
      helpType,
      description,
      imageUrls,
      location: {
        type: "Point",
        coordinates: [
          parseFloat(longitude),
          parseFloat(latitude),
        ],
      },
      priority,
    });

    /* ================= FIND NEARBY NGOS (HARD CODED 35KM) ================= */
    const nearbyNGOs = await NGO.find({
      isActive: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 35000, // 🔥 FIXED 35KM
        },
      },
    });

    /* ================= CREATE NOTIFICATIONS ================= */
    for (const ngo of nearbyNGOs) {
      await Notification.create({
        ngo: ngo._id,
        helpRequest: helpRequest._id,
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

module.exports = {
  createHelpRequest,
};
