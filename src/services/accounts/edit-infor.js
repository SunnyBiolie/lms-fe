import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const editAccountInforService = async (data) => {
  return await axiosInstance.patch(apiAccountsRoute.editInfor, data);
};
