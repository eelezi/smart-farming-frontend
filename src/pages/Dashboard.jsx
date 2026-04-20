import React, { useState } from "react";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import FilterBar from "../components/Dashboard/FilterBar";
import SortOptions from "../components/Dashboard/SortOptions";
import EntryList from "../components/Dashboard/EntryList";
import TipsList from "../components/AITips/TipsList";
import MainLayout from "../components/Layout/MainLayout";
import { useEntries } from "../hooks/useEntries";
import { useFilters } from "../hooks/useFilters";
import "../styles/dashboard.css";

function Dashboard() {
  const { entries, loading, error, setEntries } = useEntries();
  const { filters, sortBy, setFilters, setSortBy } = useFilters();
  const [selectedEntry, setSelectedEntry] = useState(null);
    console.log("Selected entry:", selectedEntry);

  // Filter entries based on filters
    const filteredEntries = (entries).filter((entry) => {
        if (filters.status && entry.status !== filters.status) return false;
        return true;
    });

    const handleDelete = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));

    };



    // const handleDelete = (id) => {
    //     const updated = entries.filter(e => e.id !== id);
    //     setEntries(updated);
    //     localStorage.setItem("farm_entries", JSON.stringify(updated)); // ← add this
    // };

    const handleUpdate = (updatedEntry) => {
        setEntries(prev =>
            prev.map(entry =>
                entry.id === updatedEntry.id ? updatedEntry : entry
            )
        );
    };


  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.plantingDate) - new Date(b.plantingDate);
      case "date-desc":
        return new Date(b.plantingDate) - new Date(a.plantingDate);
      case "name-asc":
        return a.cropType.localeCompare(b.cropType);
      case "name-desc":
        return b.cropType.localeCompare(a.cropType);
      default:
        return 0;
    }
  });

  return (

    <MainLayout>
      <div className="dashboard">
        <DashboardHeader entriesCount={sortedEntries.length} />

        <div className="dashboard-controls">
          <FilterBar filters={filters} onFiltersChange={setFilters} />
          <SortOptions sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        <div className="dashboard-content">
          <div className="entries-section">
            <h2>Your Entries</h2>
            <EntryList
              entries={sortedEntries}
              loading={loading}
              error={error}
              onSelectEntry={setSelectedEntry}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>

          <div className="tips-section">
            <TipsList entries={sortedEntries} />
          </div>
        </div>
      </div>
        {selectedEntry && (
            <div className="entry-details-overlay">
                <div className="entry-details-modal">

                    <h2>{selectedEntry.cropType}</h2>

                    <div className="details-grid">
                        <p><b>Location:</b> {selectedEntry.location}</p>
                        <p><b>Status:</b> {selectedEntry.status}</p>
                        <p><b>Area:</b> {selectedEntry.area}</p>
                        <p><b>Planting Date:</b> {selectedEntry.plantingDate}</p>
                        <p><b>Expected Harvest:</b> {selectedEntry.expectedHarvest}</p>
                        <p><b>Soil Type:</b> {selectedEntry.soilType}</p>
                        <p><b>Irrigation:</b> {selectedEntry.irrigationType}</p>
                        <p><b>Notes:</b> {selectedEntry.notes}</p>
                    </div>

                    <button
                        className="btn-primary"
                        onClick={() => {
                            console.log("SELECTED ENTRY:", selectedEntry);
                            setSelectedEntry(null);
                        }}
                    >
                        Close
                    </button>

                </div>
            </div>
        )}
   </MainLayout>







        // <MainLayout>
        //     <div style={{ color: "black" }}>
        //         DASHBOARD IS RENDERING
        //     </div>
        // </MainLayout>

   );
}

export default Dashboard;

