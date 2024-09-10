import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getBorrowingByAccountIdService = async (data) => {
  return await axiosInstance.get(
    apiTransactionsRoute.getBorrowingByAccountId,
    data
  );
};
