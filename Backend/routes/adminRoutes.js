const express = require("express");
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  getAllNGOs,
  toggleNGOStatus,
  getAllHelpRequests,
} = require("../controllers/adminController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔥 All routes protected & admin-only
router.use(protect);
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/ngos", getAllNGOs);
router.patch("/ngos/:id/toggle", toggleNGOStatus);
router.get("/help-requests", getAllHelpRequests);

module.exports = router;
