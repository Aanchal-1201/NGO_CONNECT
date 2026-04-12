const { NGO } = require("../models/index");
const { sequelize } = require("../config/db");

/* ===============================================================
   Haversine distance SQL snippet (returns metres)
   =============================================================== */
const haversineExpr = (lat, lng) => `
  (6371000 * ACOS(
    GREATEST(-1.0, LEAST(1.0, 
      COS(RADIANS(${lat})) * COS(RADIANS(latitude)) *
      COS(RADIANS(longitude) - RADIANS(${lng})) +
      SIN(RADIANS(${lat})) * SIN(RADIANS(latitude))
    ))
  ))
`;

/* ================= CREATE NGO PROFILE ================= */
const createNGO = async (req, res) => {
  try {
    if (req.user.role !== "ngo") {
      return res.status(403).json({ message: "Only NGO users allowed" });
    }

    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      description,
      registrationNumber,
      location,
    } = req.body;

    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !registrationNumber ||
      !location
    ) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingNGO = await NGO.findOne({ where: { registrationNumber } });
    if (existingNGO) {
      return res
        .status(400)
        .json({ message: "NGO with this registration number already exists" });
    }

    // location is expected as { coordinates: [lng, lat] }
    const coords =
      typeof location === "string" ? JSON.parse(location) : location;
    const longitude = coords.coordinates[0];
    const latitude = coords.coordinates[1];

    const ngo = await NGO.create({
      userId: req.user.id,
      name,
      email,
      phone,
      address,
      city,
      state,
      description,
      registrationNumber,
      latitude,
      longitude,
    });

    res.status(201).json({
      message: "NGO profile created successfully",
      ngo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= HAversine JS Function ================= */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const axios = require("axios");

/* ================= GET NEARBY NGOS ================= */
const getNearbyNGOs = async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat);
    const lng = parseFloat(req.query.lng);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Valid latitude and longitude required" });
    }

    const maxDistanceMeters = 35000; // 35km radius

    // Find all NGOs within 35km ordered by distance
    const ngos = await sequelize.query(
      `SELECT *,
              ${haversineExpr(lat, lng)} AS distance
       FROM NGOs
       WHERE ${haversineExpr(lat, lng)} <= ${maxDistanceMeters}
       ORDER BY distance ASC`,
      { type: sequelize.QueryTypes.SELECT }
    );

    res.status(200).json(ngos);
  } catch (error) {
    console.error("Explore NGOs Error:", error);
    res.status(500).json({ message: "Failed to fetch nearby NGOs" });
  }
};

module.exports = { createNGO, getNearbyNGOs };
