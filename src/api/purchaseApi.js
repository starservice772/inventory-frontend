const BASE_URL = "https://dev.starserviceinventory.cloud/api";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ Save purchase
export const savePurchase = async (payload) => {
  const res = await fetch(`${BASE_URL}/purchase/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to save purchase");
  return res.json();
};

// 🔍 Search items by item code → returns item(s) with itemDescription
export const searchItemByCode = async (itemCode) => {
  const res = await fetch(
    `${BASE_URL}/item/search/byItemCode?itemCode=${encodeURIComponent(itemCode)}`,
    { method: "GET", headers: getAuthHeaders() }
  );

  if (!res.ok) throw new Error("Failed to search item by code");

  const raw = await res.json();
  // console.log("🔍 Search raw response:", JSON.stringify(raw));

  // Unwrap envelope: { success, message, data: [...] or data: {...} }
  const payload = raw?.data ?? raw?.items ?? raw?.content ?? raw;

  // Always return an array
  return Array.isArray(payload) ? payload : [payload];
};
