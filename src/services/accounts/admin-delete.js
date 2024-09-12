import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const adminDeleteAccountService = async (data) => {
  return await axiosInstance.delete(apiAccountsRoute.adminDelete, data);
};
