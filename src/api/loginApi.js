// const BASE_URL = "https://dev.starserviceinventory.cloud/api";

import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

export default async function loginUser(payload) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let data = null;

  try {
    data = await res.json();
  } catch {
    console.log("Non-JSON response");
  }

  if (!res.ok) {
    throw new Error(data?.message || "Login failed");
  }

  return data;
};