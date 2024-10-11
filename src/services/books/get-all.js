import axiosInstance from "@/api/axios-instance";
import { apiBooksRoute } from "@/configs/api.config";

export const getAllBooksService = async (config) => {
  return await axiosInstance.get(apiBooksRoute.getAll, config);
};
