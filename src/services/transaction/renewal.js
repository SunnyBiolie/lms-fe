import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const renewalBookService = async (data) => {
  return await axiosInstance.patch(apiTransactionsRoute.renewal, data);
};
