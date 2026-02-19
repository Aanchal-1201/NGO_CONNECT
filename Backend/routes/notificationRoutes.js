const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  getUnreadCount,
} = require("../controllers/notificationController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("ngo"));

router.get("/", getMyNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/:id/read", markAsRead);

module.exports = router;
