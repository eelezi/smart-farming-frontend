import { get, post, put, delete_ } from "./api";


export const mapResponseToEntry = (r) => ({
  // keep both id and plantingId for callers that expect either
  id: r.plantingId,
  plantingId: r.plantingId,
  cropId: r.cropId,
  cropType: r.cropName,
  soilTypeId: r.soilTypeId,
  soilType: r.soilTypeName,
  // provide both location and locationName keys (some UI uses one or the other)
  location: r.locationName,
  locationName: r.locationName,
  latitude: r.latitude,
  longitude: r.longitude,
  area: r.area,
  plantingDate: r.plantingDate,
  expectedHarvestDate: r.expectedHarvestDate,
  irrigationType: r.irrigationType,   // enum string e.g. "DRIP"
  // provide both status and currentStatus to match backend DTO naming
  status: r.currentStatus,     // enum string e.g. "HEALTHY"
  currentStatus: r.currentStatus,
  notes: r.notes,
  userId: r.userId,
});

/**
 * Get all entries

 */
export const getAllEntries = async () => {
    try {
                    const data = await get("/plantings");
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
        const data = await get(`/plantings/${entryId}`);
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
        const data = await post("/plantings", entryData);
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
        const data = await put(`/plantings/${entryId}`, entryData);
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
        const data = await delete_(`/plantings/${entryId}`);
        return data;
    } catch (error) {
        console.error(`Failed to delete entry ${entryId}:`, error);
        throw error;
    }
};



export const generateRecommendation = async (plantingId, summarized = false) => {
    try {
        // Backend exposes recommendation generation at POST /plantings/{id}/recommendation
        const data = await post(`/plantings/${plantingId}/recommendation?summarized=${summarized}`);
        return data;
    } catch (error) {
        console.error(`Failed to generate recommendation for planting ${plantingId}:`, error);
        throw error;
    }
};

export default {
    getAllEntries,
    getEntry,
    createEntry,
    updateEntry,
    deleteEntry,
    generateRecommendation,
};