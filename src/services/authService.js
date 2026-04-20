import { post, get } from "./api";

/**
 * AUTH API ENDPOINTS:
 * TODO: Replace these with your actual backend endpoints
 * Examples:
 * - POST /api/auth/login - Login user
 * - POST /api/auth/register - Register new user
 * - POST /api/auth/logout - Logout user
 * - GET /api/auth/me - Get current user info
 * - POST /api/auth/refresh - Refresh auth token
 */

/**
 * Login user with credentials
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Login response with token and user info
 */
export const login = async (email, password) => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/login", { email, password });
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    // Save user info if provided
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

/**
 * Register new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} fullName - User full name
 * @param {object} additionalData - Any additional registration data
 * @returns {Promise<Object>} Registration response with token and user info
 */
export const register = async (email, password, fullName, additionalData = {}) => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/register", {
      email,
      password,
      fullName,
      ...additionalData,
    });
    
    // Save token to localStorage
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    // Save user info if provided
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

/**
 * Logout user (clear local storage and notify backend)
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    // TODO: Update endpoint to match your backend
    await post("/auth/logout", {});
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Clear local storage regardless of API response
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
  }
};

/**
 * Get current authenticated user info
 * @returns {Promise<Object>} Current user object
 */
export const getCurrentUser = async () => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await get("/auth/me");
    return data;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    throw error;
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<Object>} New token and user info
 */
export const refreshToken = async () => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/refresh", {});
    
    // Save new token to localStorage
    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }
    
    return data;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw error;
  }
};

/**
 * Get stored user info from localStorage
 * @returns {Object|null} User object or null if not logged in
 */
export const getStoredUser = () => {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error("Failed to parse stored user:", error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists in localStorage
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("authToken");
};

/**
 * Update user profile
 * @param {object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export const updateProfile = async (userData) => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/profile/update", userData);
    
    // Update stored user info
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    
    return data;
  } catch (error) {
    console.error("Profile update failed:", error);
    throw error;
  }
};

/**
 * Request password reset
 * @param {string} email - User email
 * @returns {Promise<Object>} Response from server
 */
export const requestPasswordReset = async (email) => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/password/reset-request", { email });
    return data;
  } catch (error) {
    console.error("Password reset request failed:", error);
    throw error;
  }
};

/**
 * Reset password with token
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response from server
 */
export const resetPassword = async (token, newPassword) => {
  try {
    // TODO: Update endpoint to match your backend
    const data = await post("/auth/password/reset", { token, newPassword });
    return data;
  } catch (error) {
    console.error("Password reset failed:", error);
    throw error;
  }
};

export default {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  getStoredUser,
  isAuthenticated,
  updateProfile,
  requestPasswordReset,
  resetPassword,
};

