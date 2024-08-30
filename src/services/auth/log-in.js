import axiosInstance from "@/api/axios-instance";
import { apiAuthRoute } from "@/configs/api.config";

export const logInService = async (data) => {
  return await axiosInstance.post(apiAuthRoute.logIn, data);
};
