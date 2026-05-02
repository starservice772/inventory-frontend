const BASE_URL= "https://dev.starserviceinventory.cloud/api"

export const savePurchase = async (payload) => {
  console.log("TOKEN:", localStorage.getItem("token")); //getting the correct token
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/purchase/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ✅ IMPORTANT
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to save purchase");
  }

  return res.json();
};