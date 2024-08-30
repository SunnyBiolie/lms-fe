import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const getAccountsByListIdsService = async (data) => {
  return await axiosInstance.post(apiAccountsRoute.getByListIds, data);
};
