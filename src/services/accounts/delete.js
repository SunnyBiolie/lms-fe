import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const deleteAccountService = async (data) => {
  return await axiosInstance.delete(apiAccountsRoute.delete, data);
};
