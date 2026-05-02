import React from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const { entries, loading, error, setEntries } = useEntries();
  const { filters, sortBy, setFilters, setSortBy } = useFilters();

  // Filter entries
    const filteredEntries = (entries).filter((entry) => {
        if (filters.status && entry.status !== filters.status) return false;
        return true;
    });

    const handleDelete = (id) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));

    };



    
    const handleSelectEntry = (entry) => {
        navigate(`/entry/${entry.id}`);
    };

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
              onSelectEntry={handleSelectEntry}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </div>

          <div className="tips-section">
            <TipsList entries={sortedEntries} />
          </div>
        </div>
      </div>
   </MainLayout>







        
   );
}

export default Dashboard;

