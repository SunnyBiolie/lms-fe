import axiosInstance from "@/api/axios-instance";
import { apiHistoriesRoute } from "@/configs/api.config";

export const getHistoriesByDateRangeService = async (data) => {
  return await axiosInstance.post(apiHistoriesRoute.getByDateRange, data);
};
