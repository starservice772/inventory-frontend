// const BASE_URL = "https://dev.starserviceinventory.cloud/api";

import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

export const createUser = async (userData) => {
  //const token = localStorage.getItem("token"); // ✅ FIX
  const response = await fetch(`${BASE_URL}/users/save`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};


export const getUserById = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/users/getById?id=${id}`,
    {
      method: "GET",
      headers: getAuthHeaders()
    }
  );

  let data = null;

  try {
    data = await res.json();
  } catch {
    console.log("Non-JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch user");
  }

  // Return employee object
  return data?.response || data;
};

// deactiver user (now disabled)
// export const deactivateUser = async (id) => {
//   const token = localStorage.getItem("token");

//   const res = await fetch(`${BASE_URL}/users/changeStatus?id=${id}`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   const data = await res.json().catch(() => ({}));
//   const payload = JSON.parse(atob(token.split(".")[1]));
//   console.log(payload);

//   if (!res.ok) {
//     throw new Error(data.message || "Deactivate failed");
//   }

//   return data;
// };

export const changeUserStatus = async (id) => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${BASE_URL}/users/changeStatus?id=${id}`,
    {
      method: "POST",
      headers: getAuthHeaders()
    }
  );

  if (!response.ok) {
    throw new Error("Failed to change user status");
  }

  return await response.json(); // if backend returns JSON
};


// ✅ GET USERS — clean fetch, no search (used on load & refresh)
export const getUsers = async (page = 0, size = 10) => {
  // const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/getAll/${page}/${size}`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

// 🔍 SEARCH USERS — separate API, only fired when user types in search bar
export const searchUsers = async (page = 0, search = "") => {
  // const token = localStorage.getItem("token");

  const url = `${BASE_URL}/users/getAll/${page}/10?search=${encodeURIComponent(search)}`;

  const res = await fetch(url, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to search users");
  }

  return {
    users: data?.response || [],
    totalPages: data?.totalPages || 0,
    totalRecords: data?.totalRecords || 0,
  };
};


// ✅ UPDATE USER
export const updateUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/update`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Update failed");
  }

  return result;
};
