import axios from "axios";
import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

export const forgotPassword = async (payload) => {
  const res = await axios.post(
    `${BASE_URL}/users/forgotPassword`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return res.data;
};