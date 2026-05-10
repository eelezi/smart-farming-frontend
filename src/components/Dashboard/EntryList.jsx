import React from "react";
import EntryCard from "./EntryCard";
import "../../styles/components.css";

function EntryList({ entries, loading, error, onSelectEntry,onDelete, onUpdate }) {
  if (loading) {
    return (
      <div className="entry-list loading">
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
        <div className="skeleton-card"></div>
      </div>
    );
  }

  if (error) {
    return <div className="entry-list error">Error loading entries: {error}</div>;
  }

  if (entries.length === 0) {
    return (
      <div className="entry-list empty">
        <p>No entries found. Start by adding your first crop!</p>
      </div>
    );
  }

  return (
    <div className="entry-list">
      {entries.map((entry) => (
          <EntryCard
              key={entry.id}
              entry={entry}
              onClick={() => onSelectEntry(entry)}
              onDelete={onDelete}
              onUpdate={onUpdate}
          />
      ))}
    </div>
  );
}

export default EntryList;

