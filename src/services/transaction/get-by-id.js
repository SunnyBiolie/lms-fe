import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getTransactionByIdService = async (config) => {
  return await axiosInstance.get(apiTransactionsRoute.getById, config);
};
