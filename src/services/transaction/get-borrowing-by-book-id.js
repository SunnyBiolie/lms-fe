import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getBorrowingByBookIdService = async (data) => {
  return await axiosInstance.get(apiTransactionsRoute.getBorrowingByBookId, data);
};
