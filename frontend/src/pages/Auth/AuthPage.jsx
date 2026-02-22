import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";

export default function AuthPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("login");
  const [role, setRole] = useState("user");

  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    identifier: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= PASSWORD STRENGTH ================= */
  const checkPasswordStrength = (password) => {
    let strength = 0;

    if (password.length >= 6) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^A-Za-z0-9]/)) strength++;

    setPasswordStrength(strength);
  };

  /* ================= HANDLE CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (e.target.name === "password") {
      checkPasswordStrength(e.target.value);
    }
  };

  /* ================= LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://ngo-connect-backend.onrender.com/api/auth/login",
        {
          identifier: formData.identifier,
          password: formData.password,
        }
      );

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") navigate("/admin/dashboard");
      else if (user.role === "ngo") navigate("/ngo/dashboard");
      else navigate("/");

    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (passwordStrength < 2) {
      alert("Password is too weak");
      return;
    }

    try {
      await axios.post(
        "https://ngo-connect-backend.onrender.com/api/auth/register",
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role, // only user or ngo
        }
      );

      alert("Registered Successfully. Please login.");
      setActiveTab("login");

      setFormData({
        username: "",
        email: "",
        identifier: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-wrapper d-flex justify-content-center align-items-center">
      <div className="auth-card shadow-lg">
        <h2 className="text-center mb-2">Welcome Back</h2>
        <p className="text-center text-muted mb-4">
          Empowering change through meaningful connections.
        </p>

        {/* TABS */}
        <div className="d-flex justify-content-center mb-4">
          <button
            className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>

          <button
            className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>

        {/* ================= LOGIN ================= */}
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Email or Username"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3 position-relative">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i
                className={`fa-solid ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } eye-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>

            <button className="btn btn-primary w-100 auth-btn">
              Sign In
            </button>
          </form>
        )}

        {/* ================= REGISTER ================= */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            {/* ROLE SELECTOR */}
            <div className="role-selector mb-3">
              {["user", "ngo"].map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`role-btn ${role === r ? "active" : ""}`}
                  onClick={() => setRole(r)}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-2 position-relative">
              <input
                type={showRegisterPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <i
                className={`fa-solid ${
                  showRegisterPassword ? "fa-eye-slash" : "fa-eye"
                } eye-icon`}
                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
              ></i>
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-3 position-relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="form-control mt-3"
                placeholder="Confirm Password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <i
                className={`fa-solid ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                } eye-icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>

            {/* PASSWORD STRENGTH */}
            <div className="password-strength mb-3">
              <div className={`strength-bar strength-${passwordStrength}`}></div>
            </div>

            <button className="btn btn-success w-100 auth-btn">
              Create Account
            </button>
          </form>
        )}
      </div>
    </div>
  );
}