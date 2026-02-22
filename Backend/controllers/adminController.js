const User = require("../models/userModel");
const NGO = require("../models/ngoModel");
const HelpRequest = require("../models/helpRequestModel");

/* ================= DASHBOARD STATS ================= */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalNGOs = await User.countDocuments({ role: "ngo" });
    const totalHelpRequests = await HelpRequest.countDocuments();
    const pendingRequests = await HelpRequest.countDocuments({
      status: "pending",
    });
    const resolvedRequests = await HelpRequest.countDocuments({
      status: "resolved",
    });

    res.status(200).json({
      totalUsers,
      totalNGOs,
      totalHelpRequests,
      pendingRequests,
      resolvedRequests,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL USERS ================= */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL NGOs ================= */
const getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find().populate("user", "username email");
    res.status(200).json(ngos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= TOGGLE NGO ACTIVE ================= */
const toggleNGOStatus = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({ message: "NGO not found" });
    }

    ngo.isActive = !ngo.isActive;
    await ngo.save();

    res.status(200).json({
      message: "NGO status updated",
      isActive: ngo.isActive,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL HELP REQUESTS ================= */
const getAllHelpRequests = async (req, res) => {
  try {
    const requests = await HelpRequest.find()
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ================= CREATE NEW ADMIN ================= */
const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const newAdmin = await User.create({
      username,
      email,
      password,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role,
      },
    });

  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllNGOs,
  toggleNGOStatus,
  getAllHelpRequests,
  createAdmin, // 👈 added here
};