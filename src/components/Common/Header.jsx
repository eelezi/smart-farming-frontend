import React from "react";
import "../../styles/components.css";

function Header() {
  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo-section">
          <h1 className="app-title">🌾 SmartFarming</h1>
        </div>
        <button className="user-profile">👤</button>
      </div>
    </header>
  );
}

export default Header;

