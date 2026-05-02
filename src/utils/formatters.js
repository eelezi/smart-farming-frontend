// Format date to readable format
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

// Format area with unit
export const formatArea = (area, unit = "acres") => {
  return `${parseFloat(area).toFixed(2)} ${unit}`;
};

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

