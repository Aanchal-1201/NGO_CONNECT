const express = require("express");
const router = express.Router();
const { createHelpRequest } = require("../controllers/helpRequestController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.post(
  "/create",
  protect,
  upload.array("images", 4),
  createHelpRequest
);

module.exports = router;
