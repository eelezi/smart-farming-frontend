import React from "react";
import "../../styles/components.css";

const STATUS_TIPS = {
  WARNING: (cropType) =>
    `${cropType} is showing early stress signs. Check soil moisture, inspect for pest activity, and verify irrigation coverage.`,
  CRITICAL: (cropType) =>
    `${cropType} requires immediate attention. Assess for disease, drought stress, or nutrient deficiency and take corrective action today.`,
};

function generateTips(entries) {
  if (entries.length === 0) {
    return [{
      id: "empty",
      title: "Get Started",
      description: "Add your first planting entry to receive status-based recommendations.",
      type: "info",
    }];
  }

  const actionable = entries
    .filter(e => e.status === "WARNING" || e.status === "CRITICAL")
    .map(e => ({
      id: e.id,
      title: `${e.cropType}${e.location ? ` — ${e.location}` : ""}`,
      description: STATUS_TIPS[e.status](e.cropType),
      type: e.status === "CRITICAL" ? "critical" : "warning",
    }));

  if (actionable.length === 0) {
    return [{
      id: "all-healthy",
      title: "All Entries Healthy",
      description: "Your crops are in good shape. Continue monitoring regularly and use the Entry Details page to generate AI recommendations for any planting.",
      type: "tip",
    }];
  }

  return actionable;
}

function TipsList({ entries }) {
  const tips = generateTips(entries);

  return (
    <div className="tips-section-card">
      <h2>AI Tips & Recommendations</h2>
      <div className="tips-list">
        {tips.map((tip) => (
          <div key={tip.id} className={`tip-card ${tip.type}`}>
            <div className="tip-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4m0-4h.01"/>
              </svg>
            </div>
            <div className="tip-content">
              <h4>{tip.title}</h4>
              <p>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TipsList;
