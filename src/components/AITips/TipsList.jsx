import React from "react";
import "../../styles/components.css";

function TipsList({ entries }) {
  // Mock AI tips - in production, this would come from an API
  const generateTips = () => {
    if (entries.length === 0) {
      return [
        {
          id: 1,
          title: "Get Started",
          description: "Add your first agricultural entry to receive AI-powered tips and recommendations.",
          type: "info"
        }
      ];
    }

    const tips = [];
    entries.forEach((entry) => {
      if (entry.cropType === "wheat") {
        tips.push({
          id: entry.id + 1,
          title: `Wheat Care - ${entry.location}`,
          description: "Wheat thrives in well-drained soil. Consider nitrogen-rich fertilizers in early spring.",
          type: "tip"
        });
      } else if (entry.cropType === "corn") {
        tips.push({
          id: entry.id + 2,
          title: `Corn Cultivation - ${entry.location}`,
          description: "Corn requires adequate water. Maintain soil moisture at 60-70% during growing season.",
          type: "tip"
        });
      }
    });

    return tips.length > 0 ? tips : [
      {
        id: 99,
        title: "General Tip",
        description: "Monitor your crops regularly for pests and diseases to ensure healthy growth.",
        type: "tip"
      }
    ];
  };

  const tips = generateTips();

  return (
    <div className="tips-section-card">
      <h2>AI Tips & Recommendations</h2>
      <div className="tips-list">
        {tips.map((tip) => (
          <div key={tip.id} className={`tip-card ${tip.type}`}>
            <div className="tip-icon">💡</div>
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

