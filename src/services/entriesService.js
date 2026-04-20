import { get, post, put, delete_ } from "./api";

/**
 * Get all entries

 */
export const getAllEntries = async () => {
    try {

        const data = await get("/entries");
        return data;
    } catch (error) {
        console.error("Failed to fetch entries:", error);
        throw error;
    }
};

/**
 * Get single entry by ID
 */
export const getEntry = async (entryId) => {
    try {
        const data = await get(`/entries/${entryId}`);
        return data;
    } catch (error) {
        console.error(`Failed to fetch entry ${entryId}:`, error);
        throw error;
    }
};

/**
 * Create new entry
 */
export const createEntry = async (entryData) => {
    try {
        const data = await post("/entries", entryData);
        return data;
    } catch (error) {
        console.error("Failed to create entry:", error);
        throw error;
    }
};

/**
 * Update entry
 */
export const updateEntry = async (entryId, entryData) => {
    try {
        const data = await put(`/entries/${entryId}`, entryData);
        return data;
    } catch (error) {
        console.error(`Failed to update entry ${entryId}:`, error);
        throw error;
    }
};

/**
 * Delete entry
 */
export const deleteEntry = async (entryId) => {
    try {
        const data = await delete_(`/entries/${entryId}`);
        return data;
    } catch (error) {
        console.error(`Failed to delete entry ${entryId}:`, error);
        throw error;
    }
};


/*
export const getEntriesByStatus = async (status) => {
  try {
    return await get(`/entries?status=${status}`);
  } catch (error) {
    console.error(`Failed to fetch entries by status ${status}:`, error);
    throw error;
  }
};
*/

export default {
    getAllEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
};