const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");

const PlatformSettings = sequelize.define(
  "PlatformSettings",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    maxSearchRadius: {
      type: DataTypes.INTEGER,
      defaultValue: 35000, // meters (35km)
    },
    maxImages: {
      type: DataTypes.INTEGER,
      defaultValue: 4,
    },
    notificationsEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    // Store array as JSON string
    helpTypes: {
      type: DataTypes.TEXT,
      defaultValue: JSON.stringify(["food", "medical", "shelter", "clothes"]),
      get() {
        const val = this.getDataValue("helpTypes");
        return val ? JSON.parse(val) : [];
      },
      set(val) {
        this.setDataValue("helpTypes", JSON.stringify(val));
      },
    },
  },
  { timestamps: true }
);

module.exports = PlatformSettings;
