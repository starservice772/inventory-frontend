import axios from "axios";

const API = axios.create({
  baseURL: "https://dev.starserviceinventory.cloud/api", // change in production
});

export const savePurchase = (data) => API.post("/purchase/save", data);