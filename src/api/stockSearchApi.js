import axios from "axios";

const BASE_URL = "https://dev.starserviceinventory.cloud/api";
const token = localStorage.getItem("token");

export const getStockByItemCode = async (itemCode) => {

  const response = await axios.get(
    `${BASE_URL}/stock/byItemCode`,
    {
      params: { itemCode },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};