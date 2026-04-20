import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/components.css";

function ResponsiveNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="responsive-nav">
      <button 
        className="nav-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
      
      <div className={`nav-menu ${isOpen ? "open" : ""}`}>
        <Link to="/" className="nav-item" onClick={() => setIsOpen(false)}>
          📊 Dashboard
        </Link>
        <Link to="/add-entry" className="nav-item" onClick={() => setIsOpen(false)}>
          ➕ Add Entry
        </Link>
        <Link to="/camera" className="nav-item" onClick={() => setIsOpen(false)}>
          📸 Camera
        </Link>
      </div>
    </nav>
  );
}

export default ResponsiveNav;

