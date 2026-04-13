import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Geolocation } from '@capacitor/geolocation';
import "./MapSection.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function MapSection() {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return;

    const setupMapLocation = async () => {
      try {
        const position = await Geolocation.getCurrentPosition();
        const { latitude, longitude } = position.coords;

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [longitude, latitude],
          zoom: 12,
        });

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(map.current);
      } catch (error) {
        console.error("Location access denied:", error);
      }
    };
    
    setupMapLocation();
  }, []);

  return (
    <section className="map-section container" section id="map">
      <div className="row align-items-center">
        {/* LEFT CONTENT */}
        <div className="col-md-6 map-left">
          <h2>Real-Time Assistance Network</h2>
          <p>
            Powered by geolocation and verified partnerships, we bridge the gap
            between urgent needs and trusted organizations.
          </p>

          <ul>
            <li>✔ Smart location-based request matching</li>
            <li>✔ Instant NGO notifications</li>
            <li>✔ Data-driven impact monitoring</li>
          </ul>
        </div>
        {/* MAP */}
        <div className="col-md-6">
          <div ref={mapContainer} className="map-container" />
        </div>
      </div>
    </section>
  );
}
