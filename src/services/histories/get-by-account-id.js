import axiosInstance from "@/api/axios-instance";
import { apiHistoriesRoute } from "@/configs/api.config";

export const getHistoriesByAccountIdService = async (data) => {
  return axiosInstance.get(apiHistoriesRoute.getByAccountId, data);
};
