import { NavLink } from "react-router-dom";
import "./NGOSidebar.css";

export default function NGOSidebar({ unreadCount }) {
  return (
    <div className="ngo-sidebar">
      <div className="ngo-logo">
        <i className="fa-solid fa-hand-holding-heart"></i>
        <div>
          <h5>NGO Connect</h5>
          <span>NGO Portal</span>
        </div>
      </div>

      <nav>
        <NavLink to="/ngo/dashboard">
          <i className="fa-solid fa-chart-line"></i> Dashboard
        </NavLink>

        <NavLink to="/ngo/nearby">
          <i className="fa-solid fa-location-dot"></i> Nearby Requests
        </NavLink>

        <NavLink to="/ngo/accepted">
          <i className="fa-solid fa-check"></i> Accepted
        </NavLink>

        <NavLink to="/ngo/notifications" className="notification-link">
          <i className="fa-solid fa-bell"></i> Notifications
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </NavLink>
          <hr />
        <NavLink to="/" className="logout-link">
          <i className="fa-solid fa-arrow-right-from-bracket"></i>
          Back to Site
        </NavLink>
      </nav>
    </div>
  );
}
