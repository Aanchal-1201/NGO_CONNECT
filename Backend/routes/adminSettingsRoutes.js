const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getSettings,
  updateSettings,
} = require("../controllers/adminSettingsController");

// Only Admin
router.get("/", protect, getSettings);
router.put("/", protect, updateSettings);

module.exports = router;
