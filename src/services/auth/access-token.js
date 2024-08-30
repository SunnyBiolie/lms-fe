import axiosInstance from "@/api/axios-instance";
import { apiAuthRoute } from "@/configs/api.config";

export const accessTokenService = async () => {
  return await axiosInstance.get(apiAuthRoute.accessToken);
};
