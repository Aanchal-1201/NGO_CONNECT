const Notification = require("../models/notificationModel");
const NGO = require("../models/ngoModel");

/* ================= GET MY NOTIFICATIONS ================= */
const getMyNotifications = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const notifications = await Notification.find({
      ngo: ngo._id,
    })
      .populate("helpRequest")
      .sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK AS READ ================= */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json({ message: "Marked as read" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= UNREAD COUNT ================= */
const getUnreadCount = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ user: req.user.id });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const count = await Notification.countDocuments({
      ngo: ngo._id,
      isRead: false,
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  getUnreadCount,
};
