import axiosInstance from "@/api/axios-instance";
import { apiTestRoute } from "@/configs/api.config";

export const testNumber1Service = async (config) => {
  return await axiosInstance.get(apiTestRoute.number1, config);
};
