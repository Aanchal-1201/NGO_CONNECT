import { useEffect, useState } from "react";
import axios from "axios";
import NGOSidebar from "../../components/NGOSidebar";
import NGOHeader from "../../components/NGOHeader";
import "./NGODashboard.css";

export default function NGODashboard() {
  const [stats, setStats] = useState({});
  const [requests, setRequests] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const token = localStorage.getItem("token");

  /* ================= FETCH STATS ================= */
  const fetchStats = async () => {
    try {
      const res = await axios.get("https://ngo-connect-backend.onrender.com/api/ngo/dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= FETCH NEARBY REQUESTS ================= */
const fetchRequests = async () => {
  try {
    const res = await axios.get(
      "https://ngo-connect-backend.onrender.com/api/ngo/nearby-requests",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("API RESPONSE:", res.data);

    // 🔥 Correct extraction
    setRequests(res.data.requests || []);
    
  } catch (error) {
    console.error(error);
    setRequests([]);
  }
};


  /* ================= FETCH UNREAD NOTIFICATIONS ================= */
  const fetchUnreadCount = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/notifications/unread-count",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUnreadCount(res.data.count);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= ACCEPT REQUEST ================= */
  const acceptRequest = async (id) => {
    try {
      await axios.patch(
        `https://ngo-connect-backend.onrender.com/api/ngo/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      fetchRequests();
      fetchStats();
      fetchUnreadCount(); // 🔥 update notification
    } catch (error) {
      alert(error.response?.data?.message || "Error accepting request");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRequests();
    fetchUnreadCount();

    // 🔥 Auto refresh every 10 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ngo-layout">
      <NGOSidebar unreadCount={unreadCount} />

      <div className="ngo-content">
        <NGOHeader unreadCount={unreadCount} />

        {/* ================= STATS ================= */}
        <div className="ngo-stats">
          <div className="ngo-stat-card">
            <h6>Nearby Requests</h6>
            <h2>{stats.pendingNearby || 0}</h2>
          </div>

          <div className="ngo-stat-card">
            <h6>Accepted Requests</h6>
            <h2>{stats.acceptedRequests || 0}</h2>
          </div>

          <div className="ngo-stat-card">
            <h6>Completed Tasks</h6>
            <h2>{stats.completedRequests || 0}</h2>
          </div>
        </div>

        {/* ================= REQUESTS ================= */}
        <div className="ngo-main-grid">
          <div className="requests-section">
            <h4>Nearby Help Requests</h4>

            {requests.length === 0 && (
              <p className="empty-state">No nearby requests available</p>
            )}

            {requests.map((req) => (
              <div key={req._id} className="request-card">
                <span className={`priority ${req.priority}`}>
                  {req.priority.toUpperCase()} PRIORITY
                </span>

                <h5>{req.helpType}</h5>
                <p>{req.description}</p>

                <button
                  className="accept-btn"
                  onClick={() => acceptRequest(req._id)}
                >
                  Accept Request
                </button>
              </div>
            ))}
          </div>

          <div className="activity-panel">
            <h4>Recent Activity</h4>
            <ul>
              <li>You have {unreadCount} unread notifications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
