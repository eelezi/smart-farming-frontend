// Weather service to fetch forecast data
// Uses backend Weather API (which fetches from Open-Meteo)

import { get } from "./api";

/**
 * Get weather forecast for given coordinates from backend
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @param {string} timezone - Optional timezone (defaults to auto)
 * @param {number} recommendationId - Optional recommendation ID for persistence
 * @returns {Promise<Object>} Weather forecast data
 */
export const getWeatherForecast = async (latitude, longitude, timezone = "auto", recommendationId = null) => {
  if (latitude == null || longitude == null) {
    throw new Error("Latitude and longitude are required");
  }

  try {
    // Build query parameters
    const params = new URLSearchParams();
    params.append("latitude", latitude);
    params.append("longitude", longitude);
    if (timezone && timezone !== "auto") {
      params.append("timezone", timezone);
    }
    if (recommendationId) {
      params.append("recommendation_id", recommendationId);
    }

    // Fetch from backend Weather API
    const data = await get(`/weather?${params.toString()}`);
    
    // Backend returns a list of WeatherResponse objects
    // Transform to match the expected format (Open-Meteo format)
    if (Array.isArray(data) && data.length > 0) {
      return transformBackendWeatherResponse(data);
    }
    
    throw new Error("No weather data returned from backend");
  } catch (error) {
    console.error("Weather forecast error:", error);
    throw error;
  }
};

/**
 * Transform backend WeatherResponse list to Open-Meteo format
 * @param {Array} responses - Array of WeatherResponse objects from backend
 * @returns {Object} Transformed weather data in Open-Meteo format
 */
const transformBackendWeatherResponse = (responses) => {
  // Convert backend response format to Open-Meteo format
  const daily = {
    time: [],
    weather_code: [],
    temperature_2m_max: [],
    temperature_2m_min: [],
    precipitation_sum: [],
    wind_speed_10m_max: [],
  };

  responses.forEach((resp) => {
    if (resp.time) daily.time.push(resp.time);
    if (resp.weather_code != null) daily.weather_code.push(resp.weather_code);
    if (resp.temp2mMax != null) daily.temperature_2m_max.push(resp.temp2mMax);
    if (resp.temp2mMin != null) daily.temperature_2m_min.push(resp.temp2mMin);
    if (resp.rainSum != null) daily.precipitation_sum.push(resp.rainSum);
    if (resp.windSpeedMax != null) daily.wind_speed_10m_max.push(resp.windSpeedMax);
  });

  return {
    latitude: responses[0]?.latitude,
    longitude: responses[0]?.longitude,
    timezone: responses[0]?.timezone,
    daily,
  };
};

/**
 * Get weather description from WMO code
 * @param {number} code - WMO weather code
 * @returns {string} Weather description
 */
export const getWeatherDescription = (code) => {
  const weatherCodes = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return weatherCodes[code] || "Unknown";
};
