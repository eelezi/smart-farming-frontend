import { useState, useEffect, useCallback } from "react";
import { getAllEntries } from "../services/plantingsService";

export const useEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEntries = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getAllEntries();
            setEntries(data);
        } catch (err) {
            setError(err.message || "Failed to load entries.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    return { entries, loading, error, setEntries, refetch: fetchEntries };
};