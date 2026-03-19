import "./AboutSection.css";
import TeamMatesImage from "../../../assets/5155720_2672335.jpg"; // Placeholder or use your own image if available

export default function AboutSection() {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        
        <div className="about-left">
          <h2 className="section-title">Who We Are</h2>
          <p className="about-subtitle">Driving change through verified community action.</p>
          
          <div className="about-content">
            <p>
              NGO Connect was founded with a single mission: to eliminate the friction between 
              those who desperately need help and the organizations equipped to provide it.
            </p>
            <p>
              By leveraging real-time geolocation and strict manual verification processes, 
              we ensure that every request reaches a trusted partner immediately. We believe 
              that technology should serve humanity, and our platform is built to reflect 
              that core value.
            </p>
          </div>

          <div className="about-stats">
            <div className="stat-card">
              <i className="fa-solid fa-earth-americas"></i>
              <h3>100%</h3>
              <p>Transparent</p>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-shield-halved"></i>
              <h3>Verified</h3>
              <p>Network</p>
            </div>
            <div className="stat-card">
              <i className="fa-solid fa-bolt"></i>
              <h3>Instant</h3>
              <p>Matching</p>
            </div>
          </div>
        </div>

        <div className="about-right">
          <div className="about-image-wrapper">
            <img src={TeamMatesImage} alt="" />
            <div className="glass-overlay">
              <h3>Our Vision</h3>
              <p>A world where no call for help goes unanswered.</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
