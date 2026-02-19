const NGO = require("../models/ngoModel");

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

    const existingNGO = await NGO.findOne({ registrationNumber });
    if (existingNGO) {
      return res
        .status(400)
        .json({ message: "NGO with this registration number already exists" });
    }

    const ngo = await NGO.create({
      user: req.user.id,
      name,
      email,
      phone,
      address,
      city,
      state,
      description,
      registrationNumber,
      location,
    });

    res.status(201).json({
      message: "NGO profile created successfully",
      ngo,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNGO,
};
