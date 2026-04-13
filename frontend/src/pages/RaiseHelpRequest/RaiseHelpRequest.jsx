import { useState, useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import "./RaiseHelpRequest.css";
import { Geolocation } from '@capacitor/geolocation';
import BASE_URL from "../../config";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function RaiseHelpRequest() {
  const [helpType, setHelpType] = useState("");
  const [priority, setPriority] = useState("medium");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [imageVerifications, setImageVerifications] = useState([]); // {valid, reason} per image
  const [previewImage, setPreviewImage] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);

  // AI state
  const [aiSuggestion, setAiSuggestion] = useState(null); // {helpType, priority, reason}
  const [aiLoading, setAiLoading] = useState(false);
  const aiTimer = useRef(null);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const token = localStorage.getItem("token");

  /* ================= LOCATION + MAP ================= */
  useEffect(() => {
    const setupHelpLocation = async () => {
      try {
        const pos = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = pos.coords;
        setLocation({ latitude, longitude });

        mapRef.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v11",
          center: [longitude, latitude],
          zoom: 14,
        });

        markerRef.current = new mapboxgl.Marker({ draggable: true })
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);

        markerRef.current.on("dragend", () => {
          const lngLat = markerRef.current.getLngLat();
          setLocation({ latitude: lngLat.lat, longitude: lngLat.lng });
        });
      } catch (err) {
        console.error("Location error", err);
      }
    };
    
    setupHelpLocation();
  }, []);

  /* ================= AI: ANALYZE DESCRIPTION (debounced 800ms) ================= */
  useEffect(() => {
    if (aiTimer.current) clearTimeout(aiTimer.current);
    if (description.trim().length < 15) {
      setAiSuggestion(null);
      return;
    }

    aiTimer.current = setTimeout(async () => {
      try {
        setAiLoading(true);
        const res = await axios.post(
          `${BASE_URL}/api/ai/analyze`,
          { description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAiSuggestion(res.data);
      } catch {
        // silently fail — AI is optional
      } finally {
        setAiLoading(false);
      }
    }, 800);
  }, [description]);

  /* ================= AI: APPLY SUGGESTION ================= */
  const applySuggestion = () => {
    if (!aiSuggestion) return;
    setHelpType(aiSuggestion.helpType);
    setPriority(aiSuggestion.priority);
    setAiSuggestion(null);
  };

  /* ================= AI: VERIFY IMAGE ================= */
  const verifyImageWithAI = async (file, currentHelpType) => {
    if (!currentHelpType) return { valid: true, reason: "Select a help type first" };
    try {
      const base64 = await fileToBase64(file);
      const res = await axios.post(
        `${BASE_URL}/api/ai/verify-image`,
        {
          imageBase64: base64,
          mimeType: file.type,
          helpType: currentHelpType,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch {
      return { valid: true, reason: "" };
    }
  };

  const fileToBase64 = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(file);
    });

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 4) {
      alert("Maximum 4 images allowed");
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    // Verify each new file
    const verifs = [...imageVerifications];
    for (const file of files) {
      verifs.push({ valid: null, reason: "Verifying..." });
    }
    setImageVerifications(verifs);

    // Run AI verification for each new file
    const startIdx = images.length;
    const updatedVerifs = [...verifs];
    for (let i = 0; i < files.length; i++) {
      const result = await verifyImageWithAI(files[i], helpType);
      updatedVerifs[startIdx + i] = result;
    }
    setImageVerifications([...updatedVerifs]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImageVerifications(imageVerifications.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!helpType || !location || images.length < 1) {
      alert("Please complete all required fields");
      return;
    }

    const hasInvalidImages = imageVerifications.some((v) => v && v.valid === false);
    if (hasInvalidImages) {
      alert("AI flagged one or more images as irrelevant. Please remove the flagged images before submitting.");
      return;
    }

    const isChecking = imageVerifications.some((v) => v && v.valid === null);
    if (isChecking) {
      alert("Please wait for AI image verification to complete.");
      return;
    }

    const formData = new FormData();
    formData.append("helpType", helpType);
    formData.append("description", description);
    formData.append("latitude", location.latitude);
    formData.append("longitude", location.longitude);
    formData.append("priority", priority);
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/api/help-requests/create`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Request submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="raise-container">
      <div className="raise-card">
        <h2>Raise Help Request</h2>
        <p className="subtitle">
          Provide details about the emergency. Nearby NGOs will be alerted instantly.
        </p>

        <form onSubmit={handleSubmit}>

          {/* DESCRIPTION — placed first so AI suggestion can fill fields below */}
          <div className="form-group">
            <label>DESCRIPTION</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minLength={20}
              placeholder="Describe the emergency in detail... AI will auto-suggest type & priority."
            />
            {/* AI SUGGESTION CARD */}
            {aiLoading && (
              <div className="ai-suggestion ai-loading">
                <span className="ai-pulse">🤖</span> AI is analyzing...
              </div>
            )}
            {aiSuggestion && !aiLoading && (
              <div className="ai-suggestion">
                <div className="ai-suggestion-header">
                  <span>🤖 AI Suggestion</span>
                  <button type="button" className="ai-dismiss" onClick={() => setAiSuggestion(null)}>✕</button>
                </div>
                <div className="ai-suggestion-body">
                  <span className="ai-tag type-tag">
                    📦 {aiSuggestion.helpType?.charAt(0).toUpperCase() + aiSuggestion.helpType?.slice(1)}
                  </span>
                  <span className={`ai-tag priority-tag ${aiSuggestion.priority}`}>
                    {aiSuggestion.priority === "high" ? "🔴" : aiSuggestion.priority === "medium" ? "🟡" : "🟢"}{" "}
                    {aiSuggestion.priority?.charAt(0).toUpperCase() + aiSuggestion.priority?.slice(1)} Priority
                  </span>
                </div>
                <p className="ai-reason">"{aiSuggestion.reason}"</p>
                <button type="button" className="ai-apply-btn" onClick={applySuggestion}>
                  ✨ Apply Suggestion
                </button>
              </div>
            )}
          </div>

          {/* HELP TYPE */}
          <div className="form-group">
            <label>HELP TYPE</label>
            <select value={helpType} onChange={(e) => setHelpType(e.target.value)} required>
              <option value="">Select category</option>
              <option value="food">Food</option>
              <option value="medical">Medical</option>
              <option value="shelter">Shelter</option>
              <option value="clothes">Clothes</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* PRIORITY */}
          <div className="form-group">
            <label>PRIORITY LEVEL</label>
            <div className="priority-wrapper">
              {["low", "medium", "high"].map((p) => (
                <div
                  key={p}
                  className={`priority-box ${priority === p ? "active" : ""}`}
                  onClick={() => setPriority(p)}
                >
                  <span className={`dot ${p}`}></span>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE UPLOAD */}
          <div className="form-group">
            <label>VISUAL EVIDENCE</label>
            <div className="upload-box">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} />
              <p>Upload images (1-4) — AI will verify relevance</p>
            </div>

            {/* IMAGE PREVIEW + VERIFICATION */}
            <div className="image-preview-container">
              {images.map((img, index) => {
                const verif = imageVerifications[index];
                return (
                  <div key={index} className="image-preview">
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      onClick={() => setPreviewImage(URL.createObjectURL(img))}
                    />
                    <span className="remove-btn" onClick={() => removeImage(index)}>✖</span>
                    {/* Verification badge */}
                    {verif && (
                      <div
                        className={`verif-badge ${
                          verif.valid === null
                            ? "verif-checking"
                            : verif.valid
                            ? "verif-ok"
                            : "verif-warn"
                        }`}
                        title={verif.reason}
                      >
                        {verif.valid === null ? "⏳" : verif.valid ? "✅" : "⚠️"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* MAP */}
          <div className="form-group">
            <label>CURRENT LOCATION</label>
            <div ref={mapContainer} className="map-container" />
          </div>

          <button className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Urgent Request"}
          </button>

        </form>

        {/* IMAGE MODAL */}
        {previewImage && (
          <div className="image-modal" onClick={() => setPreviewImage(null)}>
            <img src={previewImage} alt="full-preview" />
          </div>
        )}

      </div>
    </div>
  );
}