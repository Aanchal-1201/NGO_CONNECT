const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    /* ===== BASIC VALIDATION ===== */
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* ===== ONLY ALLOW USER OR NGO ===== */
    if (!["user", "ngo"].includes(role)) {
      return res.status(403).json({
        message: "Invalid role selection",
      });
    }

    /* ===== CHECK EXISTING USER ===== */
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    /* ===== CREATE USER ===== */
    const user = await User.create({
      username,
      email,
      password,
      role,
    });

    /* ===== GENERATE TOKEN ===== */
    const token = generateToken(user);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};


/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    /* ===== VALIDATION ===== */
    if (!identifier || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    /* ===== FIND USER BY EMAIL OR USERNAME ===== */
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
      ],
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    /* ===== CHECK PASSWORD ===== */
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    /* ===== GENERATE TOKEN ===== */
    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
};