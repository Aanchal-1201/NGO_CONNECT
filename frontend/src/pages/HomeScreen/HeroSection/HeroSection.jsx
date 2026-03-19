import "./HeroSection.css";
import ChatImg from "../../../assets/Dialogues_characters_01ung_03.jpg";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
  const navigate = useNavigate();
  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <h1>
          Connecting <span>Help</span> to Hope
        </h1>

        <p>
          A smart platform matching local needs with verified NGOs in real-time.
        </p>

        {/* <div className="hero-buttons">
          <button className="primary-btn" onClick={()=>navigate("/raise-request")}>Raise a Request</button>
        </div> */}
      </div>

      <div className="hero-right">
        <div className="image-wrapper">
          <img src={ChatImg} alt="hero" />
        </div>
      </div>
    </section>
  );
}
