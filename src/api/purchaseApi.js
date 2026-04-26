import axios from "axios";

const API = axios.create({
  baseURL: "http://187.127.154.62:8080", // change in production
});

export const savePurchase = (data) => API.post("/api/purchase/save", data);