import axios from "axios";
import { Base_url } from "../constants";

export const fetchTransactionsService = async ({ status, startDate, endDate }) => {
  const token = localStorage.getItem("token");
  try {
    const { data } = await axios.get(`${Base_url}/api/transactions`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      params: {
        status,
        startDate: startDate ? startDate.toISOString() : null,
        endDate: endDate ? endDate.toISOString() : null,
      },
    });
    return data; // Assuming the data is the array of transactions
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
};
