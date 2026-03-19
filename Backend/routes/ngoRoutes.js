const express = require("express");
const router = express.Router();
const { createNGO, getNearbyNGOs } = require("../controllers/ngoController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createNGO);
router.get("/nearby", protect, getNearbyNGOs);

module.exports = router;
