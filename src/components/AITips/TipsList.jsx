import React, { useEffect, useState, useContext } from "react";
import { generateRecommendation } from "../../services/plantingsService";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/components.css";

function TipsList({ entries }) {
  const { user } = useContext(AuthContext);
  const [aiTips, setAiTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Build tips from provided entries without regenerating recommendations
    const buildFromEntries = () => {
      if (!entries || entries.length === 0) {
        setAiTips([]);
        return;
      }

        const formatted = entries.map((entry, index) => ({
        id: `tip-${entry.id || index}`,
        entryId: entry.id,
        title: entry.cropType || "Crop Recommendation",
        text: entry.recommendationText || entry.recommendationSummary || "No recommendation available.",
        type: entry.recommendationText ? "ai-tip" : (entry.recommendationSummary ? "ai-tip" : "fallback-tip"),
      }));

      setAiTips(formatted);
    };

    buildFromEntries();
  }, [entries, user?.userId]);

  const generateFallbackTips = (entries) => {
    if (entries.length === 0) {
      return [{
        id: "empty",
        title: "Get Started",
        text: "Add your first planting entry to receive AI-generated recommendations.",
        type: "info",
      }];
    }

    const tips = entries.map((entry, index) => ({
      id: `fallback-${index}`,
      entryId: entry.id,
      title: `${entry.cropType}${entry.location ? ` — ${entry.location}` : ""}`,
      text: `Tips for ${entry.cropType}: Monitor soil moisture levels regularly, check for pest and disease signs, and maintain consistent care routine for optimal crop health.`,
      type: "fallback-tip",
    }));

    return tips;
  };

  const renderTipCard = (tip) => {
    const handleRegenerate = async () => {
      try {
        setLoading(true);
        const rec = await generateRecommendation(tip.entryId, true);
        setAiTips(prev => prev.map(p => p.entryId === tip.entryId ? ({ ...p, text: rec.recommendationText, type: 'ai-tip' }) : p));
      } catch (err) {
        setError(err.message || 'Failed to regenerate recommendation');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div key={tip.id} className={`tip-card ${tip.type}`}>
        <div className="tip-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 16v-4m0-4h.01"/>
          </svg>
        </div>
        <div className="tip-content">
          <h4>{tip.title}</h4>
          <p>{tip.text}</p>
          <div style={{ marginTop: '10px' }}>
            <button onClick={handleRegenerate} className="action-btn" disabled={loading}>
              {loading ? '🔄 Regenerating...' : '🔄 Regenerate'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="tips-section-card">
      <h2>AI Tips & Recommendations</h2>
      {loading && <p className="loading">Generating AI recommendations...</p>}
      {error && <p className="error">{error}</p>}
      <div className="tips-list">
        {aiTips.length > 0 ? (
          aiTips.map(renderTipCard)
        ) : (
          !loading && (
            <div className="tip-card info">
              <div className="tip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4m0-4h.01"/>
                </svg>
              </div>
              <div className="tip-content">
                <h4>No Recommendations Available</h4>
                <p>Add planting entries to receive AI-generated recommendations.</p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default TipsList;
