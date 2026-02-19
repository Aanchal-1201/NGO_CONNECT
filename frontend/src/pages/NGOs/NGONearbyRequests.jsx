import { useEffect, useState } from "react";
import axios from "axios";
import NGOSidebar from "../../components/NGOSidebar";
import NGOHeader from "../../components/NGOHeader";
import "./NGONearbyRequests.css";

export default function NGONearbyRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [ngoCoords, setNgoCoords] = useState([]);

  const token = localStorage.getItem("token");

  /* ================= FETCH REQUESTS ================= */
  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        "https://ngo-connect-backend.onrender.com/api/ngo/nearby-requests",
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setRequests(res.data.requests);
      setNgoCoords(res.data.ngoLocation);
    } catch (error) {
      console.error(error);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.patch(
        `https://ngo-connect-backend.onrender.com/api/ngo/accept/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchRequests();
    } catch (error) {
      alert(error.response?.data?.message || "Error accepting request");
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
      prev === selectedImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? selectedImages.length - 1 : prev - 1,
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

        <div className="nearby-container">
          <h4 className="page-title">Nearby Help Requests</h4>

          {requests.length === 0 ? (
            <div className="empty-state">
              <p>No nearby requests available</p>
            </div>
          ) : (
            <div className="request-grid">
              {requests.map((req) => (
                <div key={req._id} className="nearby-card">
                  {/* 🔥 SHOW ONLY FIRST IMAGE */}
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
                    <div className="card-top-row">
                      <span className={`priority ${req.priority}`}>
                        {req.priority.toUpperCase()}
                      </span>

                      {req.distance !== undefined && (
                        <span className="distance-badge">
                          {req.distance < 1000
                            ? "Very Close"
                            : `${(req.distance / 1000).toFixed(2)} km`}
                        </span>
                      )}
                    </div>

                    <h5>{req.helpType}</h5>
                    <p>{req.description}</p>

                    <button
                      className="accept-btn"
                      onClick={() => acceptRequest(req._id)}
                    >
                      Accept
                    </button>

                    <button
                      className="direction-btn"
                      onClick={() => {
                        const ngoLat = ngoCoords[1];
                        const ngoLng = ngoCoords[0];
                        const reqLat = req.location.coordinates[1];
                        const reqLng = req.location.coordinates[0];

                        const url = `https://www.google.com/maps/dir/${ngoLat},${ngoLng}/${reqLat},${reqLng}`;

                        window.open(url, "_blank");
                      }}
                    >
                      <i className="fa-solid fa-location-arrow"></i> Directions
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 🔥 IMAGE MODAL */}
        {/* 🔥 IMAGE MODAL */}
        {showModal && (
          <div className="image-modal" onClick={() => setShowModal(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking image
            >
              {/* CLOSE BUTTON */}
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* LEFT ARROW */}
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

              {/* RIGHT ARROW */}
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
