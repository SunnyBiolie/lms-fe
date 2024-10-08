import axiosInstance from "@/api/axios-instance";
import { apiAccountsRoute } from "@/configs/api.config";

export const toggleLikeBookService = async (data) => {
  return await axiosInstance.post(apiAccountsRoute.toggleLikeBook, data);
};
