const User = require("./userModel");
const NGO = require("./ngoModel");
const HelpRequest = require("./helpRequestModel");
const Notification = require("./notificationModel");
const PlatformSettings = require("./platformSettingsModel");

/* ============================================================
   ASSOCIATIONS
   ============================================================ */

// User ↔ NGO (one-to-one)
User.hasOne(NGO, { foreignKey: "userId", as: "ngoProfile" });
NGO.belongsTo(User, { foreignKey: "userId", as: "user" });

// User ↔ HelpRequest (one-to-many, requester)
User.hasMany(HelpRequest, { foreignKey: "createdById", as: "helpRequests" });
HelpRequest.belongsTo(User, { foreignKey: "createdById", as: "createdBy" });

// NGO ↔ HelpRequest (one-to-many, assigned)
NGO.hasMany(HelpRequest, { foreignKey: "assignedToId", as: "assignedRequests" });
HelpRequest.belongsTo(NGO, { foreignKey: "assignedToId", as: "assignedTo" });

// NGO ↔ Notification (one-to-many)
NGO.hasMany(Notification, { foreignKey: "ngoId", as: "notifications" });
Notification.belongsTo(NGO, { foreignKey: "ngoId", as: "ngo" });

// HelpRequest ↔ Notification (one-to-many)
HelpRequest.hasMany(Notification, { foreignKey: "helpRequestId", as: "notifications" });
Notification.belongsTo(HelpRequest, { foreignKey: "helpRequestId", as: "helpRequest" });

module.exports = { User, NGO, HelpRequest, Notification, PlatformSettings };
