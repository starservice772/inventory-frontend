import axios from "axios";
import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

// const BASE_URL = "https://dev.starserviceinventory.cloud/api";
// const token = localStorage.getItem("token");

export const getStockByItemCode = async (itemCode) => {

  const response = await axios.get(
    `${BASE_URL}/stock/byItemCode`,
    {
      params: { itemCode },
      headers: getAuthHeaders()
    }
  );

  return response.data;
};