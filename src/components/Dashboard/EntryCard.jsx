import React from "react";
import { formatDate } from "../../utils/formatters";
import "../../styles/components.css";

function EntryCard({ entry, onClick, onDelete,  onUpdate }) {
  return (
    <div className="entry-card">
      <div className="entry-card-header">
        <h3 className="entry-crop-type">{entry.cropType}</h3>
          <span className={`entry-status ${entry.status?.toLowerCase()}`}>
  {entry.status || "Unknown"}
</span>
      </div>
      
      <div className="entry-card-body">
        <div className="entry-detail">
          <span className="detail-label">Location:</span>
          <span className="detail-value">{entry.location}</span>
        </div>
        
        <div className="entry-detail">
          <span className="detail-label">Planting Date:</span>
          <span className="detail-value">{formatDate(entry.plantingDate)}</span>
        </div>
        
        <div className="entry-detail">
          <span className="detail-label">Area:</span>
          <span className="detail-value">{entry.area} {entry.areaUnit || "acres"}</span>
        </div>
      </div>

        <div className="entry-card-footer">
            <button
                className="btn-small"
                onClick={onClick}
            >
                View Details
            </button>

            <button
                className="btn-small btn-update"
                onClick={(e) => {
                    e.stopPropagation();

                    const updatedEntry = {
                        ...entry,
                        status: entry.status === "Healthy" ? "Warning" : "Healthy"
                    };

                    onUpdate(updatedEntry);
                }}
            >
                Update
            </button>

            <button
                className="btn-small btn-delete"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(entry.id);
                }}
            >
                Delete
            </button>
        </div>
    </div>
  );
}

export default EntryCard;

