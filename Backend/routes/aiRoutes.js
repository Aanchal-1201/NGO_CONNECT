const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { analyzeRequest, verifyImage, chatWithAI } = require("../controllers/aiController");

// All AI routes require authentication
router.post("/analyze", protect, analyzeRequest);
router.post("/verify-image", protect, verifyImage);
router.post("/chat", protect, chatWithAI);

module.exports = router;
