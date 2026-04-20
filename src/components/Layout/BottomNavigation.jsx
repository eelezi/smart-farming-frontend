import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/components.css";

function BottomNavigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/" 
        className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-label">Dashboard</span>
      </Link>
      <Link 
        to="/camera" 
        className={`bottom-nav-item ${isActive("/camera") ? "active" : ""}`}
      >
        <span className="nav-icon">📸</span>
        <span className="nav-label">Camera</span>
      </Link>
      <Link 
        to="/add-entry" 
        className={`bottom-nav-item ${isActive("/add-entry") ? "active" : ""}`}
      >
        <span className="nav-icon">➕</span>
        <span className="nav-label">Add Entry</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;

