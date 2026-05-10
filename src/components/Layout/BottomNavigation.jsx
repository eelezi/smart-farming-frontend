import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/components.css";

function BottomNavigation() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const getNavIcon = (path) => {
    switch (path) {
      case '/':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <line x1="9" y1="9" x2="15" y2="9"/>
            <line x1="9" y1="15" x2="15" y2="15"/>
          </svg>
        );
      case '/camera':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        );
      case '/add-entry':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="16"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
          </svg>
        );
      case '/profile':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="bottom-navigation">
      <Link 
        to="/" 
        className={`bottom-nav-item ${isActive("/") ? "active" : ""}`}
      >
        <span className="nav-icon">{getNavIcon('/')}</span>
        <span className="nav-label">Dashboard</span>
      </Link>
      <Link 
        to="/camera" 
        className={`bottom-nav-item ${isActive("/camera") ? "active" : ""}`}
      >
        <span className="nav-icon">{getNavIcon('/camera')}</span>
        <span className="nav-label">Camera</span>
      </Link>
      <Link 
        to="/add-entry" 
        className={`bottom-nav-item ${isActive("/add-entry") ? "active" : ""}`}
      >
        <span className="nav-icon">{getNavIcon('/add-entry')}</span>
        <span className="nav-label">Add Entry</span>
      </Link>
      <Link 
        to="/profile" 
        className={`bottom-nav-item ${isActive("/profile") ? "active" : ""}`}
      >
        <span className="nav-icon">{getNavIcon('/profile')}</span>
        <span className="nav-label">Profile</span>
      </Link>
    </nav>
  );
}

export default BottomNavigation;

