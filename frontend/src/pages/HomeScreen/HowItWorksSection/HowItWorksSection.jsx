import "./HowItWorksSection.css";

export default function HowItWorksSection() {
  return (
    <section className="how-it-works" id="how-it-works">
      <h2>How It Works</h2>
      <p>Three simple steps to connect.</p>

      <div className="steps">
        <div>
          <div className="icon-circle">
            <i className="fa-solid fa-file"></i>
          </div>
          <h4>Submit a Request</h4>
        </div>

        <div>
          <div className="icon-circle">
            <i className="fa-solid fa-bolt"></i>
          </div>
          <h4>Automatic Matching</h4>
        </div>

        <div>
          <div className="icon-circle">
            <i className="fa-solid fa-hand-holding-heart"></i>
          </div>
          <h4>Receive Help</h4>
        </div>
      </div>
    </section>
  );
}