import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [ngos, setNgos] = useState([]);
  const token = localStorage.getItem("token");

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/admin/dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH NGOs ================= */
  const fetchNGOs = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/admin/ngos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNgos(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= TOGGLE STATUS ================= */
  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `https://ngo-connect-backend.onrender.com/api/admin/ngos/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchNGOs();
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Toggle failed");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchNGOs();
  }, []);

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminHeader title="Dashboard Overview" />

        {/* ================= STAT CARDS ================= */}
        <div className="stats-grid">
          <div className="stat-card blue">
            <div>
              <h6>Total Users</h6>
              <h3>{stats.totalUsers || 0}</h3>
            </div>
            <i className="fa-solid fa-users"></i>
          </div>

          <div className="stat-card purple">
            <div>
              <h6>Total NGOs</h6>
              <h3>{stats.totalNGOs || 0}</h3>
            </div>
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>

          <div className="stat-card orange">
            <div>
              <h6>Pending Requests</h6>
              <h3>{stats.pendingRequests || 0}</h3>
            </div>
            <i className="fa-solid fa-clock"></i>
          </div>

          <div className="stat-card green">
            <div>
              <h6>Resolved Requests</h6>
              <h3>{stats.resolvedRequests || 0}</h3>
            </div>
            <i className="fa-solid fa-check-circle"></i>
          </div>
        </div>

        {/* ================= NGO TABLE ================= */}
        <div className="table-card">
          <h5>NGO Management</h5>

          <table className="modern-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ngos.map((ngo) => (
                <tr key={ngo._id}>
                  <td>{ngo.name}</td>
                  <td>{ngo.user?.email}</td>
                  <td>{ngo.city}</td>

                  <td>
                    <span
                      className={`status-badge ${
                        ngo.isActive
                          ? "active"
                          : "inactive"
                      }`}
                    >
                      {ngo.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td>
                    <button
                      className="toggle-btn"
                      onClick={() => toggleStatus(ngo._id)}
                    >
                      {ngo.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}

              {ngos.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">
                    No NGOs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
