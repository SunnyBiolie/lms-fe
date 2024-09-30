import axiosInstance from "@/api/axios-instance";
import { apiReportsRoute } from "@/configs/api.config";

export const getStatisticByDateService = async (data) => {
  return await axiosInstance.post(apiReportsRoute.getByDate, data);
};
