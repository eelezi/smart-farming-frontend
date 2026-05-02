import React, { useState } from "react";
import MainLayout from "../components/Layout/MainLayout";

import "../styles/add-entry.css";

function AddEntry() {
  const [formData, setFormData] = useState({
    cropType: "",
    location: "",
    fieldSize: "",
    fieldSizeUnit: "acres",
    plantingDate: "",
    expectedHarvestDate: "",
    soilType: "",
    irrigationType: "",
    currentStatus: "",
    notes: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Prepare data for backend
      const entryData = {
        cropType: formData.cropType,
        location: formData.location,
        area: parseFloat(formData.fieldSize),
        areaUnit: formData.fieldSizeUnit,
        plantingDate: formData.plantingDate,
        expectedHarvest: formData.expectedHarvestDate,
        soilType: formData.soilType,
        irrigationType: formData.irrigationType,
        status: formData.currentStatus || "Healthy",
        notes: formData.notes
      };

      //                Backend
      // const response = await createEntry(entryData);
      // console.log("Entry saved successfully:", response);
      
      // For now, just mock the save



        const existing = JSON.parse(localStorage.getItem("farm_entries") || "[]");
        const newEntry = { ...entryData, id: Date.now(), userId: "user1" };
        localStorage.setItem("farm_entries", JSON.stringify([...existing, newEntry]));
        window.dispatchEvent(new Event("entries-updated")); // ← add this
      
      setSubmitted(true);
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          cropType: "",
          location: "",
          fieldSize: "",
          fieldSizeUnit: "acres",
          plantingDate: "",
          expectedHarvestDate: "",
          soilType: "",
          irrigationType: "",
          currentStatus: "",
          notes: ""
        });
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error("Error saving entry:", err);
      setError(err.message || "Failed to save entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="add-entry-page">
        <div className="form-header">
          <h1>➕ Add New Entry</h1>
          <p>Record a new agricultural entry to your dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Crop Information</h2>

              <div className="form-group">
                  <label htmlFor="cropType">Crop Type *</label>
                  <input
                      id="cropType"
                      type="text"
                      name="cropType"
                      placeholder="e.g., Wheat, Corn, Rice..."
                      value={formData.cropType}
                      onChange={handleChange}
                      required
                  />
              </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location">Location *</label>
                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g., North Field"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="plantingDate">Planting Date *</label>
                <input
                  id="plantingDate"
                  type="date"
                  name="plantingDate"
                  value={formData.plantingDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fieldSize">Field Size *</label>
                <input
                  id="fieldSize"
                  type="number"
                  name="fieldSize"
                  placeholder="Enter field size"
                  value={formData.fieldSize}
                  onChange={handleChange}
                  required
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label htmlFor="fieldSizeUnit">Unit</label>
                <select
                  id="fieldSizeUnit"
                  name="fieldSizeUnit"
                  value={formData.fieldSizeUnit}
                  onChange={handleChange}
                >
                  <option value="acres">Acres</option>
                  <option value="hectares">Hectares</option>
                  <option value="sq-meters">Square Meters</option>
                </select>
              </div>
            </div>
          </div>

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
                <label htmlFor="soilType">Soil Type</label>
                <select
                  id="soilType"
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                >
                  <option value="">Select soil type...</option>
                  <option value="loamy">Loamy</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="silty">Silty</option>
                  <option value="muddy">Muddy</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="irrigationType">Irrigation Type</label>
                <select
                  id="irrigationType"
                  name="irrigationType"
                  value={formData.irrigationType}
                  onChange={handleChange}
                >
                  <option value="">Select irrigation type...</option>
                  <option value="drip">Drip</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="flood">Flood</option>
                  <option value="rain-fed">Rain-fed</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="currentStatus">Current Status</label>
              <select
                id="currentStatus"
                name="currentStatus"
                value={formData.currentStatus}
                onChange={handleChange}
              >
                  <option value="">Select status</option>
                  <option value="Healthy">Healthy</option>
                  <option value="Warning">Warning</option>
                  <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          <div className="form-section">
            <h2>Additional Notes</h2>

            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Add any additional notes about this entry..."
                value={formData.notes}
                onChange={handleChange}
                rows="4"
              />
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "✓ Add Entry"}
            </button>
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => window.history.back()}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>

          {submitted && (
            <div className="success-message">
              ✓ Entry added successfully! It will appear in your dashboard.
            </div>
          )}
        </form>
      </div>
    </MainLayout>
  );
}

export default AddEntry;

