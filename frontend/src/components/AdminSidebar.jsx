import { NavLink, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";

export default function AdminSidebar() {
  const navigate = useNavigate();

  return (
    <div className="admin-sidebar">

      <div className="sidebar-header">
        <i className="fa-solid fa-hand-holding-heart logo-icon"></i>
        <h5>NGO Connect</h5>
        <span className="admin-label">ADMIN PANEL</span>
      </div>

      <ul className="sidebar-menu">

        <li>
          <NavLink to="/admin/dashboard" className="sidebar-link">
            <i className="fa-solid fa-chart-pie"></i>
            <span>Overview</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/users" className="sidebar-link">
            <i className="fa-solid fa-users"></i>
            <span>Users</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/ngos" className="sidebar-link">
            <i className="fa-solid fa-building"></i>
            <span>NGOs</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/help-requests" className="sidebar-link">
            <i className="fa-solid fa-handshake"></i>
            <span>Help Requests</span>
          </NavLink>
        </li>

        <li>
          <NavLink to="/admin/settings" className="sidebar-link">
            <i className="fa-solid fa-gear"></i>
            <span>Settings</span>
          </NavLink>
        </li>

      <hr />

        <li onClick={() => navigate("/")}>
          <div className="sidebar-link logout-link">
            <i className="fa-solid fa-arrow-right-from-bracket"></i>
            <span>Back to Site</span>
          </div>
        </li>

      </ul>
    </div>
  );
}
