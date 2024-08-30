import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const returnBookService = async (data) => {
  return await axiosInstance.patch(apiTransactionsRoute.return, data);
};
