const PlatformSettings = require("../models/platformSettingsModel");

/* ================= GET SETTINGS ================= */
const getSettings = async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();

    if (!settings) {
      settings = await PlatformSettings.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UPDATE SETTINGS ================= */
const updateSettings = async (req, res) => {
  try {
    let settings = await PlatformSettings.findOne();

    if (!settings) {
      settings = await PlatformSettings.create({});
    }

    settings.maxSearchRadius = req.body.maxSearchRadius;
    settings.maxImages = req.body.maxImages;
    settings.notificationsEnabled = req.body.notificationsEnabled;
    settings.helpTypes = req.body.helpTypes;

    await settings.save();

    res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};
