import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const getReturnedByAccountIdService = async (data) => {
  return await axiosInstance.get(
    apiTransactionsRoute.getReturnedByAccountId,
    data
  );
};
