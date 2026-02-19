import { useNavigate } from "react-router-dom";
import "./AdminHeader.css";

export default function AdminHeader({ title = "Dashboard Overview" }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  // Get first letter of username
  const initial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "A";

  return (
    <div className="admin-header">
      <div className="header-left">
        <h4>{title}</h4>
      </div>

      <div className="header-right">
        <button
          className="register-btn"
          onClick={() => navigate("/admin/ngos/create")}
        >
          <i className="fa-solid fa-plus me-2"></i>
          Register NGO
        </button>

        <div className="admin-profile">
          <div className="avatar">{initial}</div>
        </div>
      </div>
    </div>
  );
}
