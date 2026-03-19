import "./FeaturesSection.css";

export default function FeaturesSection() {
  return (
    <section className="features" id="features">
      <h2>Platform Features</h2>
      <p>Empowering communities through smart technology.</p>

      <div className="feature-grid">
        <div className="feature-card">
          <i className="fa-solid fa-location-dot"></i>
          <h4>Geo-based matching</h4>
          <p>Find help in your neighborhood instantly.</p>
        </div>

        <div className="feature-card">
          <i className="fa-solid fa-bell"></i>
          <h4>Real-time notifications</h4>
          <p>Get alerts instantly when NGOs respond.</p>
        </div>

        <div className="feature-card">
          <i className="fa-solid fa-shield-heart"></i>
          <h4>Verified NGOs</h4>
          <p>Every organization is manually verified.</p>
        </div>
      </div>
    </section>
  );
}