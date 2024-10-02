import axiosInstance from "@/api/axios-instance";
import { apiHistoriesRoute } from "@/configs/api.config";

export const getOverdueService = async (data) => {
  return await axiosInstance.post(apiHistoriesRoute.getOverdue, data);
};
