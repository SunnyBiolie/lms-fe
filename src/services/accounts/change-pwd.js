import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const changePwdService = async (data) => {
  return await axiosInstance.post(apiAccountsRoute.changePwd, data);
};
