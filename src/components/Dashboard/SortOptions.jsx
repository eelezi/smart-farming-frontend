import React from "react";
import "../../styles/components.css";

function SortOptions({ sortBy, onSortChange }) {
  return (
    <div className="sort-options">
      <label htmlFor="sortBy">Sort By:</label>
      <select
        id="sortBy"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="">Default</option>
        <option value="name-asc">Crop Name (A-Z)</option>
        <option value="name-desc">Crop Name (Z-A)</option>
        <option value="date-asc">Planting Date (Oldest)</option>
        <option value="date-desc">Planting Date (Newest)</option>
      </select>
    </div>
  );
}

export default SortOptions;

