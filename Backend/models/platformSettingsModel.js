const mongoose = require("mongoose");

const platformSettingsSchema = new mongoose.Schema(
  {
    maxSearchRadius: {
      type: Number,
      default: 35000, // meters (35km)
    },

    maxImages: {
      type: Number,
      default: 4,
    },

    notificationsEnabled: {
      type: Boolean,
      default: true,
    },

    helpTypes: {
      type: [String],
      default: ["food", "medical", "shelter", "clothes"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PlatformSettings",
  platformSettingsSchema
);
