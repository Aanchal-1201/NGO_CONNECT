import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "./AdminNGOs.css";

export default function AdminNGOs() {
  const [ngos, setNgos] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchNGOs();
  }, []);

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
      console.error(error);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminHeader title="NGO Management" />

        <div className="table-card">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>State</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {ngos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center">
                    No NGOs Found
                  </td>
                </tr>
              ) : (
                ngos.map((ngo, index) => (
                  <tr key={ngo._id}>
                    <td>{index + 1}</td>
                    <td>{ngo.name}</td>
                    <td>{ngo.email}</td>
                    <td>{ngo.city}</td>
                    <td>{ngo.state}</td>

                    <td>
                      <span
                        className={`status-badge ${
                          ngo.isActive ? "active" : "inactive"
                        }`}
                      >
                        {ngo.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <button
                        className="btn btn-sm toggle-btn"
                        onClick={() => toggleStatus(ngo._id)}
                      >
                        {ngo.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
