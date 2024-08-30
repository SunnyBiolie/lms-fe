import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const editBookService = async (data) => {
  return await axiosInstance.post(apiBooksRoute.edit, data);
};
