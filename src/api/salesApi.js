// const BASE_URL = "https://dev.starserviceinventory.cloud/api";

// const getAuthHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${localStorage.getItem("token")}`,
// });

import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

/**
 * Search employee by name
 */
export const searchEmployeeByName = async (empName) => {
  const response = await fetch(
    `${BASE_URL}/employee/list?search=${encodeURIComponent(empName)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to fetch employee");
  }

  return result;
};

/**
 * Save Sales Entry
 */
export const saveSale = async (saleData) => {
  try {
    const response = await fetch(`${BASE_URL}/sale/save`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(saleData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to save sales entry");
    }

    return result;
  } catch (error) {
    console.error("Save Sale Error:", error);

    return {
      success: false,
      message: error.message,
    };
  }
};