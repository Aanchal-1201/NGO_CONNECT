const { Notification, NGO, HelpRequest } = require("../models/index");

/* ================= GET MY NOTIFICATIONS ================= */
const getMyNotifications = async (req, res) => {
  try {
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const notifications = await Notification.findAll({
      where: { ngoId: ngo.id },
      include: [{ model: HelpRequest, as: "helpRequest" }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Notification Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= MARK AS READ ================= */
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);

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
    const ngo = await NGO.findOne({ where: { userId: req.user.id } });

    if (!ngo) {
      return res.status(404).json({ message: "NGO profile not found" });
    }

    const count = await Notification.count({
      where: { ngoId: ngo.id, isRead: false },
    });

    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, getUnreadCount };
