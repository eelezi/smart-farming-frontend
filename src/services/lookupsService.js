import { get } from "./api";

/**
 * GET /api/crops  →  [{ id, name }]
 * Public endpoint (no auth required).
 */
export const getCrops = async () => {
  return get("/api/crops");
};

/**
 * GET /api/soil-types  →  [{ id, name }]
 * Public endpoint (no auth required).
 */
export const getSoilTypes = async () => {
  return get("/api/soil-types");
};

export default { getCrops, getSoilTypes };