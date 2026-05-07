import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components.css";

function DashboardHeader({ entries }) {
  const { user } = useContext(AuthContext);
  const firstName = user?.name?.split(" ")[0] ?? "Farmer";

  const healthy  = entries.filter(e => e.status === "HEALTHY").length;
  const warning  = entries.filter(e => e.status === "WARNING").length;
  const critical = entries.filter(e => e.status === "CRITICAL").length;

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <h1>Hello, {firstName}!</h1>
        <p>Welcome to your Smart Farming Dashboard</p>
      </div>
      <div className="header-stats">
        <div className="stat-card">
          <div className="stat-value">{entries.length}</div>
          <div className="stat-label">Active Entries</div>
        </div>
        <div className="stat-card stat-card--healthy">
          <div className="stat-value">{healthy}</div>
          <div className="stat-label">Healthy</div>
        </div>
        <div className="stat-card stat-card--warning">
          <div className="stat-value">{warning}</div>
          <div className="stat-label">Warning</div>
        </div>
        <div className="stat-card stat-card--critical">
          <div className="stat-value">{critical}</div>
          <div className="stat-label">Critical</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;
