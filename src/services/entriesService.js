import { get, post, put, delete_ } from "./api";


export const mapResponseToEntry = (r) => ({
  id: r.plantingId,
  cropId: r.cropId,
  cropType: r.cropName,
  soilTypeId: r.soilTypeId,
  soilType: r.soilTypeName,
  location: r.locationName,
  latitude: r.latitude,
  longitude: r.longitude,
  area: r.area,
  plantingDate: r.plantingDate,
  expectedHarvestDate: r.expectedHarvestDate,
  irrigationType: r.irrigationType,   // enum string e.g. "DRIP"
  status: r.currentStatus,     // enum string e.g. "HEALTHY"
  notes: r.notes,
  userId: r.userId,
});

/**
 * Get all entries

 */
export const getAllEntries = async () => {
    try {
        const data = await get("/entries");
        return data.map(mapResponseToEntry);
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
        return mapResponseToEntry(data);
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
        return mapResponseToEntry(data);
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



export default {
    getAllEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
};