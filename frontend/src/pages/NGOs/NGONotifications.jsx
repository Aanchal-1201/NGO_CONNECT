import { useEffect, useState } from "react";
import axios from "axios";
import NGOSidebar from "../../components/NGOSidebar";
import NGOHeader from "../../components/NGOHeader";
import "./NGONotifications.css";

export default function NGONotifications() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/notifications",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id) => {
    await axios.patch(
      `https://ngo-connect-backend.onrender.com/api/notifications/${id}/read`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchNotifications();
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="ngo-layout">
      <NGOSidebar />

      <div className="ngo-content">
        <NGOHeader />

        <div className="notification-container">
          <h4>Notifications</h4>

          {notifications.length === 0 && (
            <p className="empty-state">No notifications yet</p>
          )}

          {notifications.map((noti) => (
            <div
              key={noti._id}
              className={`notification-card ${
                noti.isRead ? "read" : "unread"
              }`}
              onClick={() => markAsRead(noti._id)}
            >
              <div>
                <h6>{noti.message}</h6>
                <small>
                  {new Date(noti.createdAt).toLocaleString()}
                </small>
              </div>

              {!noti.isRead && (
                <span className="unread-dot"></span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
