import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar">
      <div className="container">

        {/* LOGO */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <i className="fa-solid fa-hand-holding-heart logo-icon me-2"></i>
          <span className="brand-text">NGO Connect</span>
        </Link>

        {/* TOGGLER */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="fa-solid fa-bars"></i>
        </button>

        {/* NAV CONTENT */}
        <div className="collapse navbar-collapse" id="navbarContent">

          {/* CENTER LINKS */}
          <ul className="navbar-nav mx-auto text-center">
            <li className="nav-item">
              <a className="nav-link" href="#how">How It Works</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#features">Features</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">About</a>
            </li>
          </ul>

          {/* RIGHT BUTTON */}
          <div className="d-lg-flex justify-content-center">
            <button
              className="btn get-started-btn"
              onClick={() => navigate("/auth")}
            >
              Login / Signup
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
