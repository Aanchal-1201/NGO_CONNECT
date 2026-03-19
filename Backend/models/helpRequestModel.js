const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const HelpRequest = sequelize.define(
  "HelpRequest",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // createdById FK added via association in models/index.js
    // assignedToId FK added via association in models/index.js
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    helpType: {
      type: DataTypes.ENUM("food", "medical", "shelter", "clothes", "education", "other"),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Store array of image paths as JSON string
    imageUrls: {
      type: DataTypes.TEXT,
      allowNull: false,
      get() {
        const val = this.getDataValue("imageUrls");
        return val ? JSON.parse(val) : [];
      },
      set(val) {
        this.setDataValue("imageUrls", JSON.stringify(val));
      },
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "resolved"),
      defaultValue: "pending",
    },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high"),
      defaultValue: "medium",
    },
  },
  { timestamps: true }
);

module.exports = HelpRequest;
