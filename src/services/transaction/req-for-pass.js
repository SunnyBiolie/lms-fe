import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const requestForPassService = async (data) => {
  return await axiosInstance.post(apiTransactionsRoute.reqForPass, data);
};
