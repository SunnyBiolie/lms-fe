import axiosInstance from "@/api/axios-instance";
import { apiAuthRoute } from "@/configs/api.config";

export const logOutService = async () => {
  return await axiosInstance.get(apiAuthRoute.logOut);
};
