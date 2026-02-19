const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    helpType: {
      type: String,
      required: true,
      enum: ["food", "medical", "shelter", "clothes", "education", "other"],
    },

    description: {
      type: String,
    },

    imageUrls: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 1 && val.length <= 4;
        },
        message: "Minimum 1 image and maximum 4 images allowed",
      },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },

    // 🔥 NEW FIELD
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "resolved"],
      default: "pending",
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

// Geo index
helpRequestSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
