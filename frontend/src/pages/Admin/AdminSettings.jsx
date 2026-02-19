import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "./AdminSettings.css";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    maxSearchRadius: 35000,
    maxImages: 4,
    notificationsEnabled: true,
    helpTypes: [],
  });

  const token = localStorage.getItem("token");

  const fetchSettings = async () => {
    const res = await axios.get(
      "http://localhost:8080/api/admin/settings",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSettings(res.data);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleHelpTypesChange = (e) => {
    setSettings({
      ...settings,
      helpTypes: e.target.value.split(","),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.put(
      "http://localhost:8080/api/admin/settings",
      settings,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Settings Updated Successfully");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <AdminHeader title="Platform Settings" />

        <div className="settings-card">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Max Search Radius (meters)</label>
              <input
                type="number"
                name="maxSearchRadius"
                value={settings.maxSearchRadius}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="mb-3">
              <label>Max Images Per Request</label>
              <input
                type="number"
                name="maxImages"
                value={settings.maxImages}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div className="form-check mb-3">
              <input
                type="checkbox"
                name="notificationsEnabled"
                checked={settings.notificationsEnabled}
                onChange={handleChange}
                className="form-check-input"
              />
              <label className="form-check-label">
                Enable Notifications
              </label>
            </div>

            <div className="mb-3">
              <label>Help Types (comma separated)</label>
              <input
                type="text"
                value={settings.helpTypes.join(",")}
                onChange={handleHelpTypesChange}
                className="form-control"
              />
            </div>

            <button className="btn btn-primary">
              Save Settings
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
