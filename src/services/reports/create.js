import axiosInstance from "@/api/axios-instance";
import { apiReportsRoute } from "@/configs/api.config";

export const createMonthlyReportService = async (data) => {
  return await axiosInstance.post(apiReportsRoute.create, data);
};
