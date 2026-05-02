import React from "react";
import "../../styles/components.css";

function DashboardHeader({ entriesCount }) {
  // const greeting = () => {
  //   const hour = new Date().getHours();
  //   if (hour < 12) return "Good Morning";
  //   if (hour < 18) return "Good Afternoon";
  //   return "Good Evening";
  // };

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <h1>Hello Farmer!</h1>
        <p>Welcome to your Smart Farming Dashboard</p>
      </div>
      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-value">{entriesCount}</div>
          <div className="stat-label">Active Entries</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;

