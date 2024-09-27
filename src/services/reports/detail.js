import axiosInstance from "@/api/axios-instance";
import { apiReportsRoute } from "@/configs/api.config";

export const detailReportService = async (data) => {
  return await axiosInstance.get(apiReportsRoute.detail, data);
};
