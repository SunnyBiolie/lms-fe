import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const deleteBookService = async (data) => {
  return await axiosInstance.delete(apiBooksRoute.delete, data);
};
