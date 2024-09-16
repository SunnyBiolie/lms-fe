import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getRequestingByBookIdService = async (data) => {
  return await axiosInstance.get(
    apiTransactionsRoute.getRequestingByBookId,
    data
  );
};
