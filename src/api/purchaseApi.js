import axios from "axios";

const API = axios.create({
  baseURL: "https://dev.starserviceinventory.cloud", // change in production
});

export const savePurchase = (data) => API.post("/api/purchase/save", data);