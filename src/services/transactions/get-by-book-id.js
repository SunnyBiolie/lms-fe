import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getTransactionsByBookIdService = async (data) => {
  return await axiosInstance.get(apiTransactionsRoute.getByBookId, data);
};
