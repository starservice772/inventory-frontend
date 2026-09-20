// export const BASE_URL = import.meta.env.VITE_API_URL || "https://dev.starserviceinventory.cloud/api";
export const BASE_URL = import.meta.env.VITE_API_URL

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});