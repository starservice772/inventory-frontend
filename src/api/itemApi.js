const BASE_URL = "https://dev.starserviceinventory.cloud/api";


// SAVE THE ITEM
export const createItem = async (payload) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/item/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to create item");
  }

  return data;
};


// GET ALL ITEMS
export const getItems = async (page = 0, size = 30) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/item/getAll/${page}/${size}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch items");
  }

  return {
    items: data.response || [],
    totalPages: data.totalPages || 0,
    totalRecords: data.totalRecords || 0,
  };
};


// UPDATE THE ITEM
export const updateItem = async (payload) => {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}/item/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.message || "Failed to update item");
  }

  return data;
};


// GET BY ID FOR EACH ITEM
export const getItemById = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/item/getById?id=${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch item details");
  }

  return data.data;
};


// DELETE ANY ITEM
export const deleteItem = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/item/delete?id=${id}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to delete item");
    }

    return true;
};


// SEARCH ANY PARTICULAR ITEM
export const searchItems = async (page, search = "") => {
    const token = localStorage.getItem("token");

    const url = `${BASE_URL}/item/getAll/${page}/30?search=${search}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    return {
        items: data.response || [],
        totalPages: data.totalPages || 0,
        totalRecords: data.totalRecords || 0,
    };
};