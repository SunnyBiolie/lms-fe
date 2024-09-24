import axiosInstance from "@/api/axios-instance";
import { apiReportsRoute } from "@/configs/api.config";

export const getAllReportsService = async () => {
  return await axiosInstance.get(apiReportsRoute.getAll);
};
