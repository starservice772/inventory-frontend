// const BASE_URL = "https://dev.starserviceinventory.cloud/api";
// const BASE_URL = "http://localhost:8080";

import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

export const getDefectiveItems = async (
  page = 0,
  size = 30,
  search = ""
) => {
  // const token = localStorage.getItem("token");

  let url = `${BASE_URL}/defective/getAll/${page}/${size}`;

  if (search.trim().length >= 3) {
    url += `?searchKey=${encodeURIComponent(search.trim())}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch defective items");
  }

  return {
    items: data.response || [],
    totalPages: data.totalPages || 0,
    totalRecords: data.totalRecords || 0,
  };
};

export const transferDefectiveToCompany = async (payload) => {
  const res = await fetch(
    `${BASE_URL}/defective/transfer/toCompany`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.message || "Failed to transfer defective items"
    );
  }

  return data;
};