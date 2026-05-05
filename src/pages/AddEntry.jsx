import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/Layout/MainLayout";
import { createEntry } from "../services/entriesService";
import { getCrops, getSoilTypes } from "../services/lookupsService";
import { get } from "../services/api";
import "../styles/add-entry.css";

// Backend enum values (must match IrrigationType / CurrentStatus exactly)
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

const EMPTY_FORM = {
  cropId: "",
  soilTypeId: "",
  area: "",
  plantingDate: "",
  expectedHarvestDate: "",
  irrigationType: "",
  currentStatus: "",
  notes: "",
};

function AddEntry() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [crops, setCrops] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [lookupsLoading, setLookupsLoading] = useState(true);
  const [lookupsError, setLookupsError] = useState(null);

  // Location search state
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState([]);
  const [locationLoading, setLocationLoading] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const debounceRef = useRef(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Field-level validation errors (from backend or local)
  const [fieldErrors, setFieldErrors] = useState({});
  // Generic top-level error message
  const [error, setError] = useState(null);

  // Load crops and soil types from the backend on mount
  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [cropsData, soilData] = await Promise.all([
          getCrops(),
          getSoilTypes(),
        ]);
        setCrops(cropsData);
        setSoilTypes(soilData);
      } catch (err) {
        setLookupsError("Could not load crop/soil options. Is the backend running?");
      } finally {
        setLookupsLoading(false);
      }
    };
    loadLookups();
  }, []);

  // Debounced geocode search
  const handleLocationInput = (e) => {
    const query = e.target.value;
    setLocationQuery(query);
    setSelectedLocation(null);
    setLocationResults([]);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) return;

    debounceRef.current = setTimeout(async () => {
      setLocationLoading(true);
      try {
        const results = await get(`/weather/geocode?q=${encodeURIComponent(query)}`);
        setLocationResults(Array.isArray(results) ? results : []);
      } catch {
        setLocationResults([]);
      } finally {
        setLocationLoading(false);
      }
    }, 400);
  };

  const handleLocationSelect = (loc) => {
    setSelectedLocation(loc);
    setLocationQuery(loc.display_name);
    setLocationResults([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error as the user corrects it
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  /**
   * Build the CreatePlantingInformationRequest DTO the backend expects.
   * Only include optional fields when they have a value.
   */
  const buildRequestBody = () => {
    const body = {
      area: parseFloat(formData.area),
      plantingDate: formData.plantingDate,
      cropId: parseInt(formData.cropId, 10),
      soilTypeId: parseInt(formData.soilTypeId, 10),
    };

    if (selectedLocation) {
      body.locationName = selectedLocation.display_name;
      body.latitude     = parseFloat(selectedLocation.lat);
      body.longitude    = parseFloat(selectedLocation.lon);
    }

    if (formData.irrigationType)      body.irrigationType      = formData.irrigationType;
    if (formData.currentStatus)       body.currentStatus       = formData.currentStatus;
    if (formData.expectedHarvestDate) body.expectedHarvestDate = formData.expectedHarvestDate;
    if (formData.notes)               body.notes               = formData.notes;

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    try {
      setSubmitting(true);
      const requestBody = buildRequestBody();
      await createEntry(requestBody);
      setSubmitted(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1800);
    } catch (err) {
      if (err.fieldErrors) {
        // Spring @Valid field-level errors → map by field name
        const mapped = {};
        err.fieldErrors.forEach(({ field, defaultMessage }) => {
          mapped[field] = defaultMessage;
        });
        setFieldErrors(mapped);
      } else {
        // GlobalExceptionHandler message or network error
        setError(err.message || "Failed to save entry. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (lookupsLoading) {
    return (
      <MainLayout>
        <div className="add-entry-page">
          <p style={{ padding: "2rem", textAlign: "center" }}>Loading form options…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="add-entry-page">
        <div className="form-header">
          <h1>➕ Add New Entry</h1>
          <p>Record a new agricultural entry to your dashboard</p>
        </div>

        {lookupsError && (
          <div className="error-message" style={{ marginBottom: "1rem" }}>
            ⚠️ {lookupsError}
          </div>
        )}

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {submitted && (
          <div className="success-message">
            ✓ Entry added successfully! Redirecting to dashboard…
          </div>
        )}

        <form className="entry-form" onSubmit={handleSubmit} noValidate>

          {/* ── Crop Information ── */}
          <div className="form-section">
            <h2>Crop Information</h2>

            <div className="form-row">
              <div className={`form-group ${fieldErrors.cropId ? "has-error" : ""}`}>
                <label htmlFor="cropId">Crop Type *</label>
                <select
                  id="cropId"
                  name="cropId"
                  value={formData.cropId}
                  onChange={handleChange}
                  required
                  disabled={lookupsError}
                >
                  <option value="">Select crop…</option>
                  {crops.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {fieldErrors.cropId && (
                  <span className="field-error">{fieldErrors.cropId}</span>
                )}
              </div>

              <div className={`form-group ${fieldErrors.plantingDate ? "has-error" : ""}`}>
                <label htmlFor="plantingDate">Planting Date *</label>
                <input
                  id="plantingDate"
                  type="date"
                  name="plantingDate"
                  value={formData.plantingDate}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.plantingDate && (
                  <span className="field-error">{fieldErrors.plantingDate}</span>
                )}
              </div>
            </div>

            <div className="form-row">
              <div className={`form-group ${fieldErrors.area ? "has-error" : ""}`}>
                <label htmlFor="area">Field Area (hectares) *</label>
                <input
                  id="area"
                  type="number"
                  name="area"
                  placeholder="e.g. 5.2"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  min="0.01"
                  step="0.01"
                />
                {fieldErrors.area && (
                  <span className="field-error">{fieldErrors.area}</span>
                )}
              </div>

              <div className={`form-group ${fieldErrors.soilTypeId ? "has-error" : ""}`}>
                <label htmlFor="soilTypeId">Soil Type *</label>
                <select
                  id="soilTypeId"
                  name="soilTypeId"
                  value={formData.soilTypeId}
                  onChange={handleChange}
                  required
                  disabled={lookupsError}
                >
                  <option value="">Select soil type…</option>
                  {soilTypes.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {fieldErrors.soilTypeId && (
                  <span className="field-error">{fieldErrors.soilTypeId}</span>
                )}
              </div>
            </div>
          </div>

          {/* ── Location ── */}
          <div className="form-section">
            <h2>Location</h2>

            <div className="form-group">
              <label htmlFor="locationSearch">Location</label>
              <input
                id="locationSearch"
                type="text"
                placeholder="Search for a location…"
                value={locationQuery}
                onChange={handleLocationInput}
                autoComplete="off"
              />
              {locationLoading && <span className="field-hint">Searching…</span>}
              {locationResults.length > 0 && (
                <ul className="location-results">
                  {locationResults.map((loc, i) => (
                    <li key={i} onClick={() => handleLocationSelect(loc)}>
                      {loc.display_name}
                    </li>
                  ))}
                </ul>
              )}
              {selectedLocation && (
                <span className="field-hint">
                  Latitude: {parseFloat(selectedLocation.lat).toFixed(5)}, Longitude: {parseFloat(selectedLocation.lon).toFixed(5)}
                </span>
              )}
              {fieldErrors.locationName && (
                <span className="field-error">{fieldErrors.locationName}</span>
              )}
            </div>
          </div>

          {/* ── Field Details ── */}
          <div className="form-section">
            <h2>Field Details</h2>

            <div className="form-row three-columns">
              <div className="form-group">
                <label htmlFor="expectedHarvestDate">Expected Harvest Date</label>
                <input
                  id="expectedHarvestDate"
                  type="date"
                  name="expectedHarvestDate"
                  value={formData.expectedHarvestDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="irrigationType">Irrigation Type</label>
                <select
                  id="irrigationType"
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleChange}
                >
                  <option value="">Select irrigation type…</option>
                  {IRRIGATION_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="currentStatus">Current Status</label>
                <select
                  id="currentStatus"
                  name="currentStatus"
                  value={formData.currentStatus}
                  onChange={handleChange}
                >
                  <option value="">Select status…</option>
                  {STATUS_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── Notes ── */}
          <div className="form-section">
            <h2>Additional Notes</h2>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes about this entry…"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                maxLength={1000}
              />
              {fieldErrors.notes && (
                <span className="field-error">{fieldErrors.notes}</span>
              )}
              <span className="char-count">{formData.notes.length} / 1000</span>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting || submitted}>
              {submitting ? "Saving…" : "✓ Add Entry"}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => window.history.back()}
              disabled={submitting}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}

export default AddEntry;