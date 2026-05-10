import { useState, useEffect, useCallback } from "react";
import { getAllEntries } from "../services/plantingsService";
import { useInterval } from "./useInterval";

const POLL_INTERVAL_MS = 30_000;

export const useEntries = () => {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEntries = useCallback(async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            setError(null);
            const data = await getAllEntries();
            setEntries(data);
        } catch (err) {
            setError(err.message || "Failed to load entries.");
        } finally {
            if (!isBackground) setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchEntries(false);
    }, [fetchEntries]);

    useInterval(() => fetchEntries(true), POLL_INTERVAL_MS);

    const refetch = useCallback(() => fetchEntries(false), [fetchEntries]);

    return { entries, loading, error, setEntries, refetch };
};
