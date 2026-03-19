import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const collapseRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const closeNavbar = () => {
    if (window.innerWidth < 992) {
      const collapseElement = collapseRef.current;
      const bsCollapse =
        window.bootstrap?.Collapse.getInstance(collapseElement);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    closeNavbar();
    navigate("/auth");
    window.location.reload();
  };

  const isActive = (path) => {
    if (path.includes("#")) {
      return location.pathname === "/" && location.hash === path.replace("/", "");
    }
    return location.pathname === path;
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">

        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          onClick={closeNavbar}
        >
          <i className="fa-solid fa-hand-holding-heart logo-icon me-2"></i>
          <span className="brand-text">NGO Connect</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        <div
          className="collapse navbar-collapse"
          id="navbarContent"
          ref={collapseRef}
        >

          <ul className="navbar-nav mx-auto text-center">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/#how-it-works") ? "active" : ""}`}
                to="/#how-it-works"
                onClick={closeNavbar}
              >
                How It Works
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/#features") ? "active" : ""}`}
                to="/#features"
                onClick={closeNavbar}
              >
                Features
              </Link>
            </li>

            <li className="nav-item">
              <Link
                className={`nav-link ${isActive("/#about") ? "active" : ""}`}
                to="/#about"
                onClick={closeNavbar}
              >
                About
              </Link>
            </li>

            {user?.role === "user" && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/explore-ngos") ? "active highlight-link" : "highlight-link"}`}
                    to="/explore-ngos"
                    onClick={closeNavbar}
                  >
                    Explore NGOs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive("/raise-request") ? "active highlight-link" : "highlight-link"}`}
                    to="/raise-request"
                    onClick={closeNavbar}
                  >
                    Raise Request
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-lg-center text-center">
            {!user ? (
              <li className="nav-item">
                <button
                  className="btn get-started-btn mt-3 mt-lg-0"
                  onClick={() => {
                    closeNavbar();
                    navigate("/auth");
                  }}
                >
                  Login / Signup
                </button>
              </li>
            ) : (
              <li className="nav-item dropdown profile-dropdown">
                <a
                  className="nav-link dropdown-toggle d-flex align-items-center justify-content-center"
                  href="/#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  <div className="avatar-circle me-2">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <span className="username-text">
                    {user.username}
                  </span>
                </a>

                <ul className="dropdown-menu dropdown-menu-end">
                  <li className="dropdown-item-text fw-bold text-center">
                    {user.username}
                  </li>

                  <li><hr className="dropdown-divider" /></li>

                  <li>
                    <button
                      className="dropdown-item text-danger text-center"
                      onClick={handleLogout}
                    >
                      <i className="fa-solid fa-right-from-bracket me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            )}
            
            <li className="nav-item d-flex align-items-center justify-content-center">
              <ThemeToggle />
            </li>
          </ul>

        </div>
      </div>
    </nav>
  );
}