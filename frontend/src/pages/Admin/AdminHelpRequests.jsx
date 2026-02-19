import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../../components/AdminSidebar";
import AdminHeader from "../../components/AdminHeader";
import "./AdminHelpRequests.css";

export default function AdminHelpRequests() {
  const [requests, setRequests] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/admin/help-requests",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* ================= IMAGE PREVIEW ================= */
  const openPreview = (images) => {
    setPreviewImages(images);
    setCurrentIndex(0);
    setShowModal(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === previewImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? previewImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <AdminHeader title="Help Requests Monitoring" />

        <div className="requests-card">
          <h5>All Help Requests</h5>

          <table className="requests-table">
            <thead>
              <tr>
                <th>#</th>
                <th>User</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Location</th>
                <th>Images</th>
                <th>Created</th>
              </tr>
            </thead>

            <tbody>
              {requests.length > 0 ? (
                requests.map((req, index) => (
                  <tr key={req._id}>
                    <td>{index + 1}</td>

                    <td>{req.createdBy?.username}</td>

                    <td>{req.helpType}</td>

                    <td>
                      <span className={`priority-badge ${req.priority}`}>
                        {req.priority}
                      </span>
                    </td>

                    <td>
                      <span className={`status-badge ${req.status}`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Coordinates */}
                    <td>
                      <div className="coords">
                        <div>
                          <strong>Lat:</strong>{" "}
                          {req.location?.coordinates[1]}
                        </div>
                        <div>
                          <strong>Lng:</strong>{" "}
                          {req.location?.coordinates[0]}
                        </div>
                      </div>
                    </td>

                    {/* Images */}
                    <td>
                      {req.imageUrls?.length > 0 && (
                        <div
                          className="thumbnail-wrapper"
                          onClick={() =>
                            openPreview(req.imageUrls)
                          }
                        >
                          <img
                            src={`http://localhost:8080/${req.imageUrls[0]}`}
                            alt="request"
                            className="thumbnail-img"
                          />

                          {req.imageUrls.length > 1 && (
                            <div className="image-count">
                              +{req.imageUrls.length - 1}
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    <td>
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="empty-state">
                    No help requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= IMAGE MODAL ================= */}
        {showModal && (
          <div className="image-modal">
            <span
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              &times;
            </span>

            <button className="arrow left" onClick={prevImage}>
              <i className="fa-solid fa-chevron-left"></i>
            </button>

            <img
              src={`http://localhost:8080/${previewImages[currentIndex]}`}
              alt="preview"
              className="modal-image"
            />

            <button className="arrow right" onClick={nextImage}>
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
