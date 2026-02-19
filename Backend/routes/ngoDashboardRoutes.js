const express = require("express");
const router = express.Router();

const {
  getNGODashboardStats,
  getNearbyRequests,
  acceptRequest,
  completeRequest,
  getAcceptedRequests
} = require("../controllers/ngoDashboardController");

const { protect, authorize } = require("../middleware/authMiddleware");

// 🔒 All routes protected and NGO-only
router.use(protect);
router.use(authorize("ngo"));

router.get("/dashboard", getNGODashboardStats);
router.get("/nearby-requests", getNearbyRequests);
router.patch("/accept/:id", acceptRequest);
router.patch("/complete/:id", completeRequest);
router.get("/accepted", protect, authorize("ngo"), getAcceptedRequests);


module.exports = router;
