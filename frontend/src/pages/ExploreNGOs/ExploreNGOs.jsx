import { useState, useEffect, useRef } from "react";
import axios from "axios";
import mapboxgl from "mapbox-gl";
import { Geolocation } from '@capacitor/geolocation';
import BASE_URL from "../../config";
import "./ExploreNGOs.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function ExploreNGOs() {
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // 1. Get user location natively via Capacitor
    const setupLocation = async () => {
      try {
        const coordinates = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = coordinates.coords;
        setUserLocation({ latitude, longitude });
        fetchNearbyNGOs(latitude, longitude);
      } catch (err) {
        console.error("Geolocation error:", err);
        alert("Please allow location access to find nearby NGOs.");
        setLoading(false);
      }
    };
    
    setupLocation();
  }, []);

  const fetchNearbyNGOs = async (lat, lng) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/ngos/nearby?lat=${lat}&lng=${lng}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNgos(res.data);
      initializeMap(lat, lng, res.data);
    } catch (err) {
      console.error("Failed to fetch nearby NGOs", err);
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = (lat, lng, ngoList) => {
    if (mapRef.current) return; // Prevent re-initialization

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 11,
    });

    // Add User Marker (Blue)
    new mapboxgl.Marker({ color: "#2563eb" })
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML("<strong>You are here</strong>"))
      .addTo(mapRef.current);

    // Add NGO Markers (Red)
    ngoList.forEach((ngo) => {
      if (ngo.latitude && ngo.longitude) {
        const marker = new mapboxgl.Marker({ color: "#ef4444" })
          .setLngLat([ngo.longitude, ngo.latitude])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<strong>${ngo.name}</strong><br/>
               ${(ngo.distance / 1000).toFixed(1)} km away<br/>
               📞 ${ngo.phone}`
            )
          )
          .addTo(mapRef.current);
        markersRef.current.push(marker);
      }
    });
  };

  return (
    <div className="explore-container">
      <div className="explore-header">
        <h2>Explore Nearby NGOs</h2>
        <p>Find organizations within a 35km radius ready to assist with your needs.</p>
      </div>

      <div className="explore-content">
        {/* MAP SECTION */}
        <div className="map-section">
          <div ref={mapContainer} className="explore-map-container" />
        </div>

        {/* LIST SECTION */}
        <div className="ngo-list-section">
          {loading ? (
            <div className="loading-spinner">Loading nearby NGOs...</div>
          ) : ngos.length === 0 ? (
            <div className="no-ngos">
              <i className="fa-solid fa-box-open empty-icon"></i>
              <p>No NGOs found within 35km of your location.</p>
            </div>
          ) : (
            <div className="ngo-grid">
              {ngos.map((ngo) => (
                <div key={ngo.id} className="ngo-card">
                  <div className="ngo-card-header">
                    <h4>{ngo.name}</h4>
                    <span className="distance-badge">
                      {(ngo.distance / 1000).toFixed(1)} km
                    </span>
                  </div>
                  <p className="ngo-description">
                    {ngo.description?.substring(0, 100)}...
                  </p>
                  <div className="ngo-contact">
                    <span><i className="fa-solid fa-location-dot"></i> {ngo.city}, {ngo.state}</span>
                    <span><i className="fa-solid fa-phone"></i> {ngo.phone}</span>
                  </div>
                  <a href={`mailto:${ngo.email}`} className="contact-btn">
                    Contact NGO
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
