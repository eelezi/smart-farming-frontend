import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { getEntry, updateEntry, deleteEntry, generateRecommendation } from "../services/plantingsService";
import { getCrops, getSoilTypes } from "../services/lookupsService";
import { getWeatherForecast, getWeatherDescription } from "../services/weatherService";
import { generateEntryPdf } from "../services/plantingPdfService";
import "../styles/entry-details.css";

const IRRIGATION_OPTIONS = [
  { value: "DRIP", label: "Drip" },
  { value: "SPRINKLER", label: "Sprinkler" },
  { value: "FLOOD", label: "Flood" },
  { value: "FURROW", label: "Furrow" },
  { value: "RAIN_FED", label: "Rain-fed" },
  { value: "MANUAL", label: "Manual" },
];

const STATUS_OPTIONS = [
  { value: "HEALTHY", label: "Healthy" },
  { value: "WARNING", label: "Warning" },
  { value: "CRITICAL", label: "Critical" },
];

const STATUS_LABEL = { HEALTHY: "Healthy", WARNING: "Warning", CRITICAL: "Critical" };
const IRRIGATION_LABEL = Object.fromEntries(
  IRRIGATION_OPTIONS.map((o) => [o.value, o.label])
);

function EntryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  const [crops, setCrops] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editFieldErrors, setEditFieldErrors] = useState({});
  const [editError, setEditError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', message }

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState(null);

  const [pdfGenerating, setPdfGenerating] = useState(false);

  const [recommendationGenerating, setRecommendationGenerating] = useState(false);

  const showFeedback = (type, message, durationMs = 3500) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), durationMs);
  };

  // Load entry + lookups on mount
  useEffect(() => {
    const load = async () => {
      try {
        const [entryData, cropsData, soilData] = await Promise.all([
          getEntry(id),
          getCrops(),
          getSoilTypes(),
        ]);
        setEntry(entryData);
        setCrops(cropsData);
        setSoilTypes(soilData);

        // Fetch weather if coordinates are available
        if (entryData.latitude != null && entryData.longitude != null) {
          try {
            setWeatherLoading(true);
            const weatherData = await getWeatherForecast(
              entryData.latitude,
              entryData.longitude,
              "auto",
              entryData.recommendationId
            );
            setWeather(weatherData);
          } catch (err) {
            console.error("Weather fetch error:", err);
            setWeatherError(err.message || "Failed to load weather forecast");
          } finally {
            setWeatherLoading(false);
          }
        }
      } catch (err) {
        setFetchError(err.message || "Failed to load entry.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // ── Edit ──────────────────────────────────────────────────────────────────
  const openEdit = () => {
    setEditError(null);
    setEditFieldErrors({});
    setEditFormData({
      area: entry.area ?? "",
      plantingDate: entry.plantingDate ?? "",
      cropId: entry.cropId ?? "",
      soilTypeId: entry.soilTypeId ?? "",
      locationName: entry.locationName ?? "",
      latitude: entry.latitude ?? "",
      longitude: entry.longitude ?? "",
      irrigationType: entry.irrigationType ?? "",
      currentStatus: entry.currentStatus ?? "",
      expectedHarvestDate: entry.expectedHarvestDate ?? "",
      notes: entry.notes ?? "",
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
    if (editFieldErrors[name]) {
      setEditFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const buildUpdateBody = () => {
    const body = {
      area: parseFloat(editFormData.area),
      plantingDate: editFormData.plantingDate,
      cropId: parseInt(editFormData.cropId, 10),
      soilTypeId: parseInt(editFormData.soilTypeId, 10),
      // currentStatus is @NotNull in UpdateRequest
      currentStatus: editFormData.currentStatus || "HEALTHY",
    };
    if (editFormData.locationName)       body.locationName      = editFormData.locationName;
    if (editFormData.latitude !== "")    body.latitude          = parseFloat(editFormData.latitude);
    if (editFormData.longitude !== "")   body.longitude         = parseFloat(editFormData.longitude);
    if (editFormData.irrigationType)     body.irrigationType    = editFormData.irrigationType;
    if (editFormData.expectedHarvestDate) body.expectedHarvestDate = editFormData.expectedHarvestDate;
    if (editFormData.notes)              body.notes             = editFormData.notes;
    return body;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError(null);
    setEditFieldErrors({});
    try {
      setEditSubmitting(true);
      const updated = await updateEntry(id, buildUpdateBody());
      setEntry(updated);
      setShowEditModal(false);
      showFeedback("success", "Entry updated successfully!");
    } catch (err) {
      if (err.fieldErrors) {
        const mapped = {};
        err.fieldErrors.forEach(({ field, defaultMessage }) => {
          mapped[field] = defaultMessage;
        });
        setEditFieldErrors(mapped);
      } else {
        setEditError(err.message || "Failed to update entry.");
      }
    } finally {
      setEditSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    try {
      setDeleteLoading(true);
      await deleteEntry(id);
      setShowDeleteModal(false);
      showFeedback("success", "Entry deleted. Redirecting…");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      showFeedback("error", err.message || "Failed to delete entry.");
      setDeleteLoading(false);
    }
  };

  // ── PDF Generation ─────────────────────────────────────────────────────────
  const handleGeneratePdf = async () => {
    try {
      setPdfGenerating(true);
      await generateEntryPdf(id);
      showFeedback("success", "PDF downloaded successfully!");
    } catch (err) {
      showFeedback("error", err.message || "Failed to generate PDF.");
    } finally {
      setPdfGenerating(false);
    }
  };

  // ── Recommendation Generation ──────────────────────────────────────────────
  const handleRegenerateRecommendation = async () => {
    try {
      setRecommendationGenerating(true);
      const newRec = await generateRecommendation(id, true);
      setEntry((prev) => ({
        ...prev,
        recommendationId: newRec.recommendationId,
        recommendationText: newRec.recommendationText,
        recommendationCreatedAt: newRec.createdAt,
      }));
      showFeedback("success", "Recommendation updated successfully!");
    } catch (err) {
      showFeedback("error", err.message || "Failed to generate recommendation.");
    } finally {
      setRecommendationGenerating(false);
    }
  };

  // ── Weather helpers ────────────────────────────────────────────────────────
  const getWeatherIcon = (code) => {
    const icons = {
      0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️", 45: "🌫️", 48: "🌫️",
      51: "🌧️", 53: "🌧️", 55: "🌧️", 61: "🌧️", 63: "🌧️", 65: "⛈️",
      71: "🌨️", 73: "🌨️", 75: "🌨️", 80: "🌧️", 81: "⛈️", 82: "⛈️",
      85: "🌨️", 86: "🌨️", 95: "⛈️", 96: "⛈️", 99: "⛈️",
    };
    return icons[code] || "🌡️";
  };

  const getDay = (dateStr) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const date = new Date(dateStr);
    return days[date.getDay()];
  };

  // ── Render ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout>
        <div className="entry-details-container">
          <div className="loading">Loading entry details…</div>
        </div>
      </MainLayout>
    );
  }

  if (fetchError || !entry) {
    return (
      <MainLayout>
        <div className="entry-details-container">
          <div className="error">{fetchError || "Entry not found."}</div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="entry-details-container">

        <div className="details-header">
          <button className="nav-btn back-btn" onClick={() => navigate("/")}>
            ← Back to Dashboard
          </button>
          <h1>{entry.cropType} Entry Details</h1>
        </div>

        {feedback && (
          <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
        )}

        {/* Entry information */}
        <section className="entry-info">
          <h2>Entry Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Crop Type</label>
              <p>{entry.cropType}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <p>{entry.locationName || "—"}</p>
            </div>
            <div className="info-item">
              <label>Area (ha)</label>
              <p>{entry.area}</p>
            </div>
            <div className="info-item">
              <label>Planting Date</label>
              <p>{entry.plantingDate ? new Date(entry.plantingDate).toLocaleDateString() : "—"}</p>
            </div>
            <div className="info-item">
              <label>Expected Harvest</label>
              <p>{entry.expectedHarvestDate ? new Date(entry.expectedHarvestDate).toLocaleDateString() : "—"}</p>
            </div>
            <div className="info-item">
              <label>Status</label>
              <p className={`status ${(entry.currentStatus || "").toLowerCase()}`}>
                {STATUS_LABEL[entry.currentStatus] || entry.currentStatus || "—"}
              </p>
            </div>
            <div className="info-item">
              <label>Soil Type</label>
              <p>{entry.soilType || "—"}</p>
            </div>
            <div className="info-item">
              <label>Irrigation</label>
              <p>{IRRIGATION_LABEL[entry.irrigationType] || entry.irrigationType || "—"}</p>
            </div>
            {(entry.latitude != null && entry.longitude != null) && (
              <div className="info-item">
                <label>Coordinates</label>
                <p>{entry.latitude}, {entry.longitude}</p>
              </div>
            )}
            <div className="info-item full-width">
              <label>Notes</label>
              <p>{entry.notes || "—"}</p>
            </div>
          </div>
        </section>

        {/* Weather Section */}
        {weather && !weatherLoading && (
          <section className="weather-section">
            <h2>🌤️ Local Weather Forecast</h2>
            {weather.daily && weather.daily.time && weather.daily.time.length > 0 ? (
              <>
                {/* Current Conditions */}
                <div className="current-weather">
                  <div className="weather-main">
                    <div className="weather-icon">
                      {getWeatherIcon(weather.daily.weather_code?.[0])}
                    </div>
                    <div className="weather-details">
                      <h3>
                        {weather.daily.temperature_2m_max?.[0]
                          ? Math.round(weather.daily.temperature_2m_max[0])
                          : "--"}
                        °C
                      </h3>
                      <p>
                        {getWeatherDescription(weather.daily.weather_code?.[0] || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="weather-stats">
                    <div className="stat">
                      <span>💧</span>
                      <span>
                        {weather.daily.precipitation_sum?.[0]
                          ? Math.round(weather.daily.precipitation_sum[0] * 10) / 10
                          : 0}
                        mm
                      </span>
                      <span>Rainfall</span>
                    </div>
                    <div className="stat">
                      <span>💨</span>
                      <span>
                        {weather.daily.wind_speed_10m_max?.[0]
                          ? Math.round(weather.daily.wind_speed_10m_max[0])
                          : 0}
                        mph
                      </span>
                      <span>Wind</span>
                    </div>
                  </div>
                </div>

                {/* 5-Day Forecast */}
                <div>
                  <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>5-Day Forecast</h3>
                  <div className="forecast-grid">
                    {weather.daily.time.slice(0, 5).map((date, idx) => (
                      <div key={idx} className="forecast-day">
                        <div className="day-name">{getDay(date)}</div>
                        <span className="day-icon">
                          {getWeatherIcon(weather.daily.weather_code?.[idx])}
                        </span>
                        <div className="temp-range">
                          <span style={{ color: "#e74c3c" }}>
                            {weather.daily.temperature_2m_max?.[idx]
                              ? Math.round(weather.daily.temperature_2m_max[idx])
                              : "--"}
                            °
                          </span>
                          <span style={{ color: "#3498db" }}>
                            {weather.daily.temperature_2m_min?.[idx]
                              ? Math.round(weather.daily.temperature_2m_min[idx])
                              : "--"}
                            °
                          </span>
                        </div>
                        <p className="precipitation">
                          {weather.daily.precipitation_sum?.[idx]
                            ? Math.round(weather.daily.precipitation_sum[idx] * 10) / 10
                            : 0}
                          mm rain
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ color: "#666", textAlign: "center", padding: "20px" }}>
                No weather data available
              </div>
            )}
          </section>
        )}

        {weatherLoading && (
          <section className="weather-section">
            <div className="loading">Loading weather forecast…</div>
          </section>
        )}

        {weatherError && !weather && (
          <section className="weather-section">
            <div style={{ color: "#dc3545", padding: "20px", textAlign: "center" }}>
              ⚠️ {weatherError}
            </div>
          </section>
        )}

        {/* Recommendation Section */}
        {entry.recommendationText && (
          <section style={{
            background: "white",
            borderRadius: "12px",
            padding: "25px",
            marginBottom: "25px",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
            borderLeft: "4px solid #667eea",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              paddingBottom: "15px",
              borderBottom: "2px solid #667eea",
            }}>
              <h2 style={{
                color: "#2c3e50",
                margin: 0,
                fontSize: "1.5rem",
              }}>
                🤖 AI Recommendation
              </h2>
              <button
                onClick={handleRegenerateRecommendation}
                disabled={recommendationGenerating}
                style={{
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: recommendationGenerating ? "not-allowed" : "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  opacity: recommendationGenerating ? 0.6 : 1,
                }}
              >
                {recommendationGenerating ? "🔄 Updating..." : "🔄 Regenerate"}
              </button>
            </div>
            <div style={{
              color: "#555",
              lineHeight: "1.8",
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              fontSize: "0.95rem",
            }}>
              {entry.recommendationText}
            </div>
            {entry.recommendationCreatedAt && (
              <div style={{
                marginTop: "15px",
                fontSize: "0.85rem",
                color: "#999",
                fontStyle: "italic",
              }}>
                Last updated: {new Date(entry.recommendationCreatedAt).toLocaleString()}
              </div>
            )}
          </section>
        )}

        <section className="action-buttons">
          <button className="action-btn edit-btn" onClick={openEdit}>
            ✏️ Edit Entry
          </button>
          <button
            className="action-btn"
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
            }}
            onClick={handleGeneratePdf}
            disabled={pdfGenerating}
          >
            📄 {pdfGenerating ? "Generating PDF…" : "Download PDF"}
          </button>
          <button className="action-btn delete-btn" onClick={() => setShowDeleteModal(true)}>
            🗑️ Delete Entry
          </button>
        </section>

        {/* ── Edit Modal ── */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Edit Entry</h2>
                <button className="modal-close" onClick={() => setShowEditModal(false)}>✕</button>
              </div>

              {editError && (
                <div className="error-message" style={{ margin: "0 0 1rem" }}>⚠️ {editError}</div>
              )}

              <form onSubmit={handleEditSubmit} className="edit-form" noValidate>
                <div className="form-grid">

                  {/* Crop */}
                  <div className={`form-group ${editFieldErrors.cropId ? "has-error" : ""}`}>
                    <label>Crop Type *</label>
                    <select name="cropId" value={editFormData.cropId} onChange={handleEditChange} required>
                      <option value="">Select crop…</option>
                      {crops.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {editFieldErrors.cropId && <span className="field-error">{editFieldErrors.cropId}</span>}
                  </div>

                  {/* Soil Type */}
                  <div className={`form-group ${editFieldErrors.soilTypeId ? "has-error" : ""}`}>
                    <label>Soil Type *</label>
                    <select name="soilTypeId" value={editFormData.soilTypeId} onChange={handleEditChange} required>
                      <option value="">Select soil type…</option>
                      {soilTypes.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    {editFieldErrors.soilTypeId && <span className="field-error">{editFieldErrors.soilTypeId}</span>}
                  </div>

                  {/* Area */}
                  <div className={`form-group ${editFieldErrors.area ? "has-error" : ""}`}>
                    <label>Area (hectares) *</label>
                    <input type="number" name="area" value={editFormData.area} onChange={handleEditChange}
                      required min="0.01" step="0.01" />
                    {editFieldErrors.area && <span className="field-error">{editFieldErrors.area}</span>}
                  </div>

                  {/* Planting Date */}
                  <div className={`form-group ${editFieldErrors.plantingDate ? "has-error" : ""}`}>
                    <label>Planting Date *</label>
                    <input type="date" name="plantingDate" value={editFormData.plantingDate} onChange={handleEditChange} required />
                    {editFieldErrors.plantingDate && <span className="field-error">{editFieldErrors.plantingDate}</span>}
                  </div>

                  {/* Status — @NotNull in UpdateRequest */}
                  <div className={`form-group ${editFieldErrors.currentStatus ? "has-error" : ""}`}>
                    <label>Current Status *</label>
                    <select name="currentStatus" value={editFormData.currentStatus} onChange={handleEditChange} required>
                      <option value="">Select status…</option>
                      {STATUS_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                    {editFieldErrors.currentStatus && <span className="field-error">{editFieldErrors.currentStatus}</span>}
                  </div>

                  {/* Irrigation */}
                  <div className="form-group">
                    <label>Irrigation Type</label>
                    <select name="irrigationType" value={editFormData.irrigationType} onChange={handleEditChange}>
                      <option value="">Select irrigation type…</option>
                      {IRRIGATION_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location name */}
                  <div className="form-group">
                    <label>Location Name</label>
                    <input type="text" name="locationName" value={editFormData.locationName}
                      onChange={handleEditChange} maxLength={255} />
                  </div>

                  {/* Harvest date */}
                  <div className="form-group">
                    <label>Expected Harvest Date</label>
                    <input type="date" name="expectedHarvestDate" value={editFormData.expectedHarvestDate} onChange={handleEditChange} />
                  </div>

                  {/* Lat / Lng */}
                  <div className={`form-group ${editFieldErrors.latitude ? "has-error" : ""}`}>
                    <label>Latitude</label>
                    <input type="number" name="latitude" value={editFormData.latitude}
                      onChange={handleEditChange} min="-90" max="90" step="any" />
                    {editFieldErrors.latitude && <span className="field-error">{editFieldErrors.latitude}</span>}
                  </div>
                  <div className={`form-group ${editFieldErrors.longitude ? "has-error" : ""}`}>
                    <label>Longitude</label>
                    <input type="number" name="longitude" value={editFormData.longitude}
                      onChange={handleEditChange} min="-180" max="180" step="any" />
                    {editFieldErrors.longitude && <span className="field-error">{editFieldErrors.longitude}</span>}
                  </div>

                  {/* Notes */}
                  <div className="form-group full-width">
                    <label>Notes</label>
                    <textarea name="notes" value={editFormData.notes} onChange={handleEditChange}
                      rows="4" maxLength={1000} />
                    {editFieldErrors.notes && <span className="field-error">{editFieldErrors.notes}</span>}
                  </div>
                </div>

                <div className="modal-actions">
                  <button type="button" className="btn-secondary"
                    onClick={() => setShowEditModal(false)} disabled={editSubmitting}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary" disabled={editSubmitting}>
                    {editSubmitting ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── Delete Confirmation Modal ── */}
        {showDeleteModal && (
          <div className="modal-overlay">
            <div className="modal-content delete-modal">
              <div className="modal-header">
                <h2>Delete Entry</h2>
                <button className="modal-close" onClick={() => setShowDeleteModal(false)}>✕</button>
              </div>
              <div className="delete-content">
                <h3>Are you sure?</h3>
                <p>
                  This will permanently delete the entry for{" "}
                  <strong>{entry.cropType}</strong>
                  {entry.locationName ? ` at ${entry.locationName}` : ""}.
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
                  Cancel
                </button>
                <button className="btn-danger" onClick={confirmDelete} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting…" : "Delete Entry"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}

export default EntryDetails;