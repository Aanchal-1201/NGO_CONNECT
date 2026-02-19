const User = require("../models/userModel");
const generateToken = require("./../utils/generateToken");

/* ================= REGISTER ================= */
const register = async (req, res) => {
  try {
    const { username, email, password, role, adminSecret } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check existing email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔐 ADMIN REGISTRATION PROTECTION
    if (role === "admin") {
      if (!adminSecret || adminSecret !== process.env.ADMIN_REGISTER_SECRET) {
        return res.status(403).json({
          message: "Invalid admin secret key",
        });
      }
    }

    const user = await User.create({
      username,
      email,
      password,
      role,
    });

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
    res.status(500).json({ message: error.message });
  }
};

/* ================= LOGIN ================= */
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }],
    }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

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
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
