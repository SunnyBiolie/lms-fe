import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getTransactionsService = async (data) => {
  return await axiosInstance.get(apiTransactionsRoute.get, data);
};
