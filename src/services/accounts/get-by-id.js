import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const getAccountByIdService = async (data) => {
  return await axiosInstance.get(apiAccountsRoute.getById, data);
};
