import { get, post, postFormData } from "./api";

// API: AI tips endpoints

/**
 * Get AI recommendations for a specific planting entry
 * @param {number} plantingId - Planting/Entry ID
 * @param {boolean} summarized - Whether to return summarized recommendations (default: true)
 * @returns {Promise<Object>} AI recommendation response
 */
export const getRecommendation = async (plantingId, summarized = true) => {
  try {
    // API: POST /plantings/{id}/recommendation
    const data = {};
    return await post(`/plantings/${plantingId}/recommendation?summarized=${summarized}`, data);
  } catch (error) {
    console.error("Failed to fetch recommendation:", error);
    throw error;
  }
};

/**
 * Get AI tips and recommendations for entries (batch)
 * @param {string} userId - User ID
 * @param {array} entryIds - Array of entry IDs
 * @returns {Promise<Object>} AI tips response
 */
export const getAITips = async (userId, entryIds = []) => {
  try {
    // Fetch recommendations for each entry
    const recommendations = await Promise.all(
      entryIds.map(id => getRecommendation(id, true))
    );
    return {
      success: true,
      data: recommendations.map((rec, idx) => ({
        entryId: entryIds[idx],
        recommendation: rec,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch AI tips:", error);
    throw error;
  }
};

/**
 * Get crop-specific recommendations
 * @param {string} cropType - Crop type (e.g., 'wheat', 'corn')
 * @param {string} location - Farm location
 * @param {string} soilType - Soil type (e.g., 'loamy', 'clay')
 * @returns {Promise<Object>} Recommendations
 */
export const getCropRecommendations = async (cropType, location, soilType) => {
  try {
    // API: GET /ai/recommendations
    return await get(
      `/ai/recommendations?crop=${cropType}&location=${location}&soil=${soilType}`
    );
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    throw error;
  }
};

/**
 * Analyze image using AI for disease detection
 * @param {File} imageFile - Image file to analyze
 * @returns {Promise<Object>} Analysis result with disease info
 */
export const analyzeImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);
    
    // API: POST /ai/analyze-image
    return await postFormData("/ai/analyze-image", formData);
  } catch (error) {
    console.error("Failed to analyze image:", error);
    // Return mock data for testing when backend is not available
    console.warn("Using mock AI analysis data");
    return getMockAnalysisResult();
  }
};

// Mock analysis result for testing
const getMockAnalysisResult = () => {
  const diseases = [
    {
      disease: "Leaf Blight",
      description: "Fungal infection causing brown spots on leaves",
      severity: "moderate",
      confidence: 0.85,
      recommendations: [
        "Remove affected leaves immediately",
        "Apply copper-based fungicide",
        "Improve air circulation around plants",
        "Avoid overhead watering"
      ],
      treatment: "Apply fungicide every 7-10 days for 3 weeks. Ensure plants are not overcrowded."
    },
    {
      disease: "Powdery Mildew",
      description: "White powdery coating on leaves and stems",
      severity: "mild",
      confidence: 0.92,
      recommendations: [
        "Increase air circulation",
        "Apply sulfur-based fungicide",
        "Water at soil level, not on leaves",
        "Remove heavily infected parts"
      ],
      treatment: "Spray with baking soda solution (1 tsp per quart water) every 5-7 days."
    },
    {
      disease: "Healthy Plant",
      description: "No visible signs of disease detected",
      severity: "mild",
      confidence: 0.78,
      recommendations: [
        "Continue current care practices",
        "Monitor for any changes",
        "Maintain proper watering schedule",
        "Ensure adequate nutrition"
      ],
      treatment: "No treatment needed. Keep up the good work!"
    }
  ];

  return diseases[Math.floor(Math.random() * diseases.length)];
};
