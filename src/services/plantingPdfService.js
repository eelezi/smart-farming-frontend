import { getAuthToken } from "./api";

const API_BASE_URL = "/api";

/**
 * Generate and download PDF report for a planting entry
 * @param {number} plantingId - ID of the planting to generate PDF for
 * @returns {Promise<void>}
 */
export const generateEntryPdf = async (plantingId) => {
  if (!plantingId) {
    throw new Error("Planting ID is required");
  }

  try {
    const token = getAuthToken();
    const headers = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/plantings/${plantingId}/report`, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to download this PDF");
      } else if (response.status === 404) {
        throw new Error("Planting not found");
      } else {
        throw new Error(`Failed to generate PDF: HTTP ${response.status}`);
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;

    const contentDisposition = response.headers.get("content-disposition");
    let filename = "planting-report.pdf";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?([^"]+)"?/);
      if (match && match[1]) {
        filename = match[1];
      }
    }

    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
};

export default {
  generateEntryPdf,
};
