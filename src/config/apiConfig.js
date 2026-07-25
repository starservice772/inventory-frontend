export const BASE_URL = "https://dev.starserviceinventory.cloud/api";

export const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});