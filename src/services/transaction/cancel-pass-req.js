import axiosInstance from "@/api/axios-instance";
import { apiTransactionsRoute } from "@/configs/api.config";

export const cancelPassReqService = async (data) => {
  return await axiosInstance.delete(apiTransactionsRoute.cancelPassReq, data);
};
