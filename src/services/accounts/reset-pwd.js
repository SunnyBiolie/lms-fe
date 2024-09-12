import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const resetPasswordService = async (data) => {
  return await axiosInstance.patch(apiAccountsRoute.resetPassword, data);
};
