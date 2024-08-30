import axiosInstance from "@/api/axios-instance";
import { apiAuthRoute } from "@/configs/api.config";

export const signUpService = async (data) => {
  return await axiosInstance.post(apiAuthRoute.signUp, data);
};
