import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const countTransactionsByBookIdService = async (data) => {
  return await axiosInstance.get(apiTransactionsRoute.countByBookId, data);
};
