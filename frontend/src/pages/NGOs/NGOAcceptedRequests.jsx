import { useEffect, useState } from "react";
import axios from "axios";
import NGOSidebar from "../../components/NGOSidebar";
import NGOHeader from "../../components/NGOHeader";
import "./NGOAcceptedRequests.css";

export default function NGOAcceptedRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/ngo/accepted",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= COMPLETE ================= */
  const completeRequest = async (id) => {
    try {
      await axios.patch(
        `https://ngo-connect-backend.onrender.com/api/ngo/complete/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Error completing request");
    }
  };

  /* ================= IMAGE PREVIEW ================= */
  const openPreview = (images) => {
    setSelectedImages(images);
    setCurrentIndex(0);
    setShowModal(true);
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === selectedImages.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="ngo-layout">
      <NGOSidebar />
      <div className="ngo-content">
        <NGOHeader />

        <div className="accepted-container">
          <h3>Accepted Requests</h3>

          {requests.length === 0 ? (
            <p className="empty-state">No accepted requests</p>
          ) : (
            <div className="accepted-grid">
              {requests.map((req) => (
                <div key={req._id} className="accepted-card">

                  {/* IMAGE */}
                  <div
                    className="image-wrapper"
                    onClick={() => openPreview(req.imageUrls)}
                  >
                    <img
                      src={`https://ngo-connect-backend.onrender.com/${req.imageUrls[0]}`}
                      alt="request"
                    />
                  </div>

                  <div className="card-body">
                    <span className={`priority ${req.priority}`}>
                      {req.priority.toUpperCase()}
                    </span>

                    <h5>{req.helpType}</h5>
                    <p>{req.description}</p>

                    <button
                      className="complete-btn"
                      onClick={() => completeRequest(req._id)}
                    >
                      Mark as Completed
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* IMAGE MODAL */}
        {showModal && (
          <div className="image-modal" onClick={() => setShowModal(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {selectedImages.length > 1 && (
                <button className="arrow left" onClick={prevImage}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
              )}

              <img
                src={`https://ngo-connect-backend.onrender.com/${selectedImages[currentIndex]}`}
                alt="preview"
                className="modal-image"
              />

              {selectedImages.length > 1 && (
                <button className="arrow right" onClick={nextImage}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
