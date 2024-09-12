import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const getAccountsByRoleService = async (data) => {
  return await axiosInstance.get(apiAccountsRoute.getByRole, data);
};
