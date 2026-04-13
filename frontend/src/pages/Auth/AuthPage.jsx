import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import BASE_URL from "../../config";

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

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

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
        `${BASE_URL}/api/auth/login`,
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
      alert(error.response?.data?.message || `Error: ${error.message}`);
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
        `${BASE_URL}/api/auth/register`,
        {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role,
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
      alert(error.response?.data?.message || `Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-container container-fluid">
      <div className="row min-vh-100">

        {/* LEFT SIDE */}
        <div className="col-lg-6 d-none d-lg-flex auth-left">
          <div className="left-content">
            <h1>NGO Connect</h1>
            <h2>Connecting Help to Hope</h2>
            <p>
              A smart platform matching local needs with verified NGOs in real-time.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 d-flex justify-content-center align-items-center auth-right">
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

            {/* LOGIN FORM */}
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
                  <span
                    className="eye-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    👁
                  </span>
                </div>

                <button className="btn btn-primary w-100 auth-btn">
                  Sign In
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {activeTab === "register" && (
              <form onSubmit={handleRegister}>
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
                  <span
                    className="eye-icon"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    👁
                  </span>
                </div>

                <div className="mb-3 position-relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="eye-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    👁
                  </span>
                </div>

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

      </div>
    </div>
  );
}