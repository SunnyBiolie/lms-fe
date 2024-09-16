import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const passBookService = async (data) => {
  return await axiosInstance.patch(apiTransactionsRoute.passBook, data);
};
