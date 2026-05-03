const BASE_URL = "https://dev.starserviceinventory.cloud/api";

export const createUser = async (userData) => {
  const token = localStorage.getItem("token"); // ✅ FIX
  const response = await fetch(`${BASE_URL}/users/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // ✅ safe
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  return response.json();
};

export const deactivateUser = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/users/changeStatus?id=${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => ({}));
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log(payload);

  if (!res.ok) {
    throw new Error(data.message || "Deactivate failed");
  }

  return data;
};

// ✅ GET USERS
export const getUsers = async (page = 0, size = 10) => {
  const token = localStorage.getItem("token");
  console.log("TOKEN:", token); // 🔍 check this

  const res = await fetch(`${BASE_URL}/users/getAll/${page}/${size}`, {
    method: "GET",
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch users");
  }

  return data;
};

// ✅ UPDATE USER
export const updateUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Update failed");
  }

  return result;
};
