import { postFormData } from "./api";

export const formatDiseaseStatus = (status) => {
  if (!status) return "Unknown Status";
  
  switch (status) {
    case "DISEASE_FOUND":
      return "Disease Detected";
    case "DISEASE_NOT_FOUND":
      return "No Disease Detected";
    case "UNRECOGNIZABLE":
      return "Image Unrecognizable";
    default:
      // Fallback for unknown enums: replace underscores with spaces and capitalize
      return status
        .replace(/_/g, " ")
        .replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
};

export const getPlantDiseaseInfo = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const data = await postFormData("/diseases/predict", formData);
    console.log("Disease info received:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch disease info:", error);
    throw error;
  }
};