import "./NGOHeader.css";

export default function NGOHeader() {
  return (
    <div className="ngo-header">
      <div className="header-left">
        <h3>Community Overview</h3>
        <p>Welcome back, here is what's happening today.</p>
      </div>

      <div className="header-actions">
        <div className="search-wrapper">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search requests..."
          />
        </div>

        <button className="new-btn">
          <i className="fa-solid fa-plus"></i>
          <span>New Campaign</span>
        </button>
      </div>
    </div>
  );
}
