import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/purchase/save", // change in production
});

export const savePurchase = (data) => API.post("/purchase/save", data);