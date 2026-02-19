import { useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="row">
          {/* COLUMN 1 */}
          <div className="col-lg-3 col-md-6 footer-col">
            <div className="footer-brand d-flex align-items-center mb-3">
              <i className="fa-solid fa-hand-holding-heart me-2 footer-logo"></i>
              <h5 className="mb-0 fw-bold">NGO Connect</h5>
            </div>

            <p className="footer-text">
              Building a world where help is just a request away. Connecting
              communities through smart, verified collaboration.
            </p>
          </div>

          {/* PLATFORM */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h6
              className="footer-title"
              onClick={() => toggleSection("platform")}
            >
              Platform
              <i className="fa-solid fa-chevron-down mobile-icon"></i>
            </h6>

            <ul
              className={`footer-links ${
                openSection === "platform" ? "show" : ""
              }`}
            >
              <li>How it Works</li>
              <li>Verified NGOs</li>
              <li>Success Stories</li>
              <li>Safety & Security</li>
            </ul>
          </div>

          {/* COMPANY */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h6
              className="footer-title"
              onClick={() => toggleSection("company")}
            >
              Company
              <i className="fa-solid fa-chevron-down mobile-icon"></i>
            </h6>

            <ul
              className={`footer-links ${
                openSection === "company" ? "show" : ""
              }`}
            >
              <li>About Us</li>
              <li>Careers</li>
              <li>Press Kit</li>
              <li>Contact</li>
            </ul>
          </div>

          {/* NEWSLETTER */}
          {/* NEWSLETTER */}
          <div className="col-lg-3 col-md-6 footer-col">
            <h6 className="footer-title static-title">Newsletter</h6>

            <div className="newsletter-box show">
              <p className="footer-text">
                Stay updated with our latest impact stories.
              </p>

              <input
                type="email"
                className="form-control mb-2"
                placeholder="Your email"
              />

              <button className="btn btn-primary w-100 subscribe-btn">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <hr className="footer-divider" />

        <div className="footer-bottom d-flex justify-content-between flex-wrap">
          <p className="mb-2">© 2026 NGO Connect. All rights reserved.</p>

          <div className="footer-policy">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
