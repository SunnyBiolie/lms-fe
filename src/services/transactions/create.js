import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const createTransactionService = async (data) => {
  return await axiosInstance.post(apiTransactionsRoute.create, data);
};
