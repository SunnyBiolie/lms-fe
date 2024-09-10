import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getTransactionsByDateRangeService = async (data) => {
  return await axiosInstance.post(
    apiTransactionsRoute.getTransactionsByDateRange,
    data
  );
};
