const express = require("express");
const router = express.Router();
const { createNGO } = require("../controllers/ngoController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createNGO);

module.exports = router;
