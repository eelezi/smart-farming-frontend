import { useState, useEffect } from "react";
// import { getAllEntries } from "../services/entriesService";

const mockEntries = [
    {
        id: 1,
        userId: "user1",
        cropType: "wheat",
        location: "North Field",
        plantingDate: "2025-03-15",
        area: 50,
        areaUnit: "acres",
        status: "Healthy",
        soilType: "loamy",
        expectedHarvest: "2025-08-15"
    },
    {
        id: 2,
        userId: "user1",
        cropType: "corn",
        location: "South Field",
        plantingDate: "2025-04-01",
        area: 75,
        areaUnit: "acres",
        status: "Warning",
        soilType: "clay",
        expectedHarvest: "2025-10-01"
    },
    {
        id: 3,
        userId: "user1",
        cropType: "rice",
        location: "East Paddock",
        plantingDate: "2025-05-10",
        area: 40,
        areaUnit: "acres",
        status: "Critical",
        soilType: "muddy",
        expectedHarvest: "2025-09-20"
    },
    {
        id: 4,
        userId: "user1",
        cropType: "soybeans",
        location: "West Field",
        plantingDate: "2025-04-20",
        area: 60,
        areaUnit: "acres",
        status: "Healthy",
        soilType: "loamy",
        expectedHarvest: "2025-09-15"
    }
];

const USE_MOCK = true;

export const useEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchEntries = async () => {
    //         try {
    //             setLoading(true);
    //
    //             if (USE_MOCK) {
    //                 setEntries(mockEntries);
    //                 return;
    //             }
    //
    //             const data = await getAllEntries();
    //
    //             const mapped = data.map(entry => ({
    //                 id: entry.plantingId,
    //                 cropType: entry.cropName,
    //                 location: entry.locationName,
    //                 area: entry.area,
    //                 plantingDate: entry.plantingDate,
    //                 expectedHarvest: entry.expectedHarvestDate,
    //                 soilType: entry.soilTypeName,
    //                 irrigationType: entry.irrigationType,
    //                 status: entry.currentStatus,
    //                 notes: entry.notes
    //             }));
    //
    //             setEntries(mapped);
    //
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //
    //     fetchEntries();
    // }, []);

    useEffect(() => {
        const fetchEntries = async () => {
            try {
                setLoading(true);
                const saved = localStorage.getItem("farm_entries");
                if (saved) {
                    setEntries(JSON.parse(saved));
                } else {
                    localStorage.setItem("farm_entries", JSON.stringify(mockEntries));
                    setEntries(mockEntries);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const handleEntriesUpdate = (event) => {
            console.log('entries-updated event received in useEntries:', event.detail);
            if (event.detail && event.detail.updatedEntries) {
                setEntries(event.detail.updatedEntries);
            }
        };

        const handleStorageEvent = () => {
            console.log('Storage event received, refreshing entries');
            fetchEntries();
        };

        fetchEntries();
        window.addEventListener("entries-updated", handleEntriesUpdate);
        window.addEventListener("storage", handleStorageEvent);
        return () => {
            window.removeEventListener("entries-updated", handleEntriesUpdate);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, []);

    return { entries, loading, error, setEntries };
};
