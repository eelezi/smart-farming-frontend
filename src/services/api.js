// Base API configuration and HTTP helper functions

// Using relative path so Vite proxy handles the routing to the backend
const API_BASE_URL = "/api";

/**
 * Helper function to get auth token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

/**
 * Helper function to build headers with auth token
 */
const getHeaders = (contentType = "application/json") => {
  const headers = {
    "Content-Type": contentType,
  };

  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Handle API response and errors
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    let errorPayload;
    try {
      errorPayload = await response.json();
    } catch {
      throw new Error(`HTTP Error: ${response.status}`);
    }
 
    // Spring MethodArgumentNotValidException sends a list under "errors"
    if (Array.isArray(errorPayload.errors)) {
      const apiError = new Error("Validation failed");
      apiError.fieldErrors = errorPayload.errors; // [{field, defaultMessage}]
      throw apiError;
    }
 
    // GlobalExceptionHandler / controller string body
    const message =
      errorPayload.message ||
      (typeof errorPayload === "string" ? errorPayload : null) ||
      `HTTP Error: ${response.status}`;
    throw new Error(message);
  }
 
  if (response.status === 204) return null;
  return response.json();
};

/**
 * GET request
 * @param {string} endpoint - API endpoint (e.g., '/plantings')
 * @param {object} options - Additional fetch options
 */
export const get = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`GET ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * POST request
 * @param {string} endpoint - API endpoint (e.g., '/plantings')
 * @param {object} data - Data to send in request body
 * @param {object} options - Additional fetch options
 */
export const post = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`POST ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * POST request with FormData (for file uploads)
 * @param {string} endpoint - API endpoint (e.g., '/ai/analyze-image')
 * @param {FormData} formData - FormData object containing files
 * @param {object} options - Additional fetch options
 */
export const postFormData = async (endpoint, formData, options = {}) => {
  try {
    const headers = {};
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: headers,
      body: formData,
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`POST ${endpoint} (FormData) failed:`, error);
    throw error;
  }
};

/**
 * PUT request (update)
 * @param {string} endpoint - API endpoint (e.g., '/plantings/1')
 * @param {object} data - Data to send in request body
 * @param {object} options - Additional fetch options
 */
export const put = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`PUT ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * DELETE request
 * @param {string} endpoint - API endpoint (e.g., '/plantings/1')
 * @param {object} options - Additional fetch options
 */
export const delete_ = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`DELETE ${endpoint} failed:`, error);
    throw error;
  }
};

/**
 * PATCH request (partial update)
 * @param {string} endpoint - API endpoint (e.g., '/plantings/1')
 * @param {object} data - Data to send in request body
 * @param {object} options - Additional fetch options
 */
export const patch = async (endpoint, data = {}, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    return await handleResponse(response);
  } catch (error) {
    console.error(`PATCH ${endpoint} failed:`, error);
    throw error;
  }
};

export default {
  get,
  post,
  postFormData,
  put,
  delete: delete_,
  patch,
};

