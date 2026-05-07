import React from "react";
import "../../styles/components.css";

function FilterBar({ filters, onFiltersChange }) {

    const handleFilterChange = (key, value) => {
        onFiltersChange({ ...filters, [key]: value });
    };

    const handleReset = () => {
        onFiltersChange({ status: "" });
    };

    return (
        <div className="filter-bar">
            <div className="filter-group">
                <label htmlFor="status">Status</label>
                <select
                    id="status"
                    value={filters.status || ""}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="filter-input"
                >
                    <option value="">All</option>
                    <option value="HEALTHY">Healthy</option>
                    <option value="WARNING">Warning</option>
                    <option value="CRITICAL">Critical</option>
                </select>
            </div>

            <button className="reset-btn" onClick={handleReset}>
                Reset Filter
            </button>
        </div>
    );
}

export default FilterBar;